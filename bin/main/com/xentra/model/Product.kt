package com.xentra.model

import com.google.firebase.database.Transaction
import com.xentra.config.FirebaseService
import com.xentra.config.Node
import com.xentra.config.asNode
import com.xentra.config.await
import com.xentra.config.int
import com.xentra.config.read
import com.xentra.config.str
import com.xentra.config.transaction
import kotlinx.serialization.Serializable
import java.time.Instant

// ============================================================
// MODELO: Producto
// Estructura de datos + lectura/escritura en Firebase (/products/{id})
// ============================================================

val CATEGORIES = listOf("Tecnología", "Accesorios de Oficina", "Accesorios", "Mobiliario", "Papelería")

@Serializable
data class Product(
    val id: String,
    val name: String,
    val code: String,
    val category: String,
    val stock: Int,
    val minStock: Int,
    val location: String = "",
    val image: String? = null,
    val createdAt: String,
    val updatedAt: String? = null,
) {
    val isLowStock: Boolean get() = stock < minStock
}

/** Datos que envía el frontend al crear o editar un producto. */
@Serializable
data class ProductInput(
    val name: String? = null,
    val code: String? = null,
    val category: String? = null,
    val stock: Int? = null,
    val minStock: Int? = null,
    val location: String? = null,
    val image: String? = null,
)

/** Resultado de cambiar el stock: si se guardó y cuánto había. */
data class StockChange(val saved: Boolean, val stockBefore: Int)

object ProductModel {
    private const val PATH = "products"
    private fun ref() = FirebaseService.ref(PATH)

    private fun fromNode(id: String, m: Node) = Product(
        id = id,
        name = m.str("name"),
        code = m.str("code"),
        category = m.str("category", CATEGORIES[0]),
        stock = m.int("stock"),
        minStock = m.int("minStock"),
        location = m.str("location"),
        image = m["image"]?.toString()?.takeIf { it.isNotBlank() },
        createdAt = m.str("createdAt", Instant.EPOCH.toString()),
        updatedAt = m["updatedAt"]?.toString(),
    )

    private fun Product.toNode(): Map<String, Any?> = mapOf(
        "name" to name,
        "code" to code,
        "category" to category,
        "stock" to stock,
        "minStock" to minStock,
        "location" to location,
        "image" to image,
        "createdAt" to createdAt,
        "updatedAt" to updatedAt,
    )

    /** Todos los productos, del más reciente al más antiguo. */
    suspend fun findAll(): List<Product> =
        ref().read().children
            .mapNotNull { child -> child.asNode()?.let { fromNode(child.key, it) } }
            .sortedByDescending { it.createdAt }

    suspend fun findById(id: String): Product? {
        val node = ref().child(id).read().asNode() ?: return null
        return fromNode(id, node)
    }

    suspend fun isEmpty(): Boolean = !ref().read().exists()

    /** Genera un id nuevo de Firebase. */
    fun newId(): String = ref().push().key ?: Instant.now().toEpochMilli().toString()

    /** Crea o reemplaza un producto. */
    suspend fun save(product: Product) {
        ref().child(product.id).setValueAsync(product.toNode()).await()
    }

    suspend fun delete(id: String) {
        ref().child(id).removeValueAsync().await()
    }

    /**
     * Suma (delta > 0) o resta (delta < 0) unidades en una transacción atómica,
     * para que dos usuarios a la vez no dejen el stock mal.
     * No se guarda si el resultado quedaría negativo.
     */
    suspend fun changeStock(id: String, delta: Int): StockChange {
        var before = 0
        val saved = FirebaseService.ref("$PATH/$id/stock").transaction { current ->
            val stock = (current.value as? Number)?.toInt()
            if (stock == null) {
                // Valor aún no cargado: Firebase reintenta automáticamente con el valor real.
                Transaction.success(current)
            } else {
                before = stock
                if (stock + delta < 0) {
                    Transaction.abort()
                } else {
                    current.value = stock + delta
                    Transaction.success(current)
                }
            }
        }
        return StockChange(saved, before)
    }
}
