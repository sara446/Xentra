package com.xentra.model

import com.xentra.config.FirebaseService
import com.xentra.config.Node
import com.xentra.config.asNode
import com.xentra.config.await
import com.xentra.config.int
import com.xentra.config.read
import com.xentra.config.str
import kotlinx.serialization.Serializable
import java.time.Instant

// ============================================================
// MODELO: Movimiento (entrada / salida de inventario)
// Estructura de datos + lectura/escritura en Firebase (/movements/{id})
// ============================================================

object MovementTypes {
    const val IN = "entrada"
    const val OUT = "salida"
}

@Serializable
data class Movement(
    val id: String,
    val productId: String,
    val productName: String,
    val productCode: String,
    val type: String,
    val quantity: Int,
    val note: String = "",
    val user: String,
    val userId: String? = null,
    val date: String,
)

/** Datos que envía el frontend al registrar un movimiento. */
@Serializable
data class MovementInput(
    val productId: String? = null,
    val type: String? = null,
    val quantity: Int? = null,
    val note: String? = null,
)

object MovementModel {
    private const val PATH = "movements"
    private fun ref() = FirebaseService.ref(PATH)

    private fun fromNode(id: String, m: Node) = Movement(
        id = id,
        productId = m.str("productId"),
        productName = m.str("productName"),
        productCode = m.str("productCode"),
        type = m.str("type", MovementTypes.IN),
        quantity = m.int("quantity"),
        note = m.str("note"),
        user = m.str("user", "Usuario"),
        userId = m["userId"]?.toString(),
        date = m.str("date", Instant.EPOCH.toString()),
    )

    private fun Movement.toNode(): Map<String, Any?> = mapOf(
        "productId" to productId,
        "productName" to productName,
        "productCode" to productCode,
        "type" to type,
        "quantity" to quantity,
        "note" to note,
        "user" to user,
        "userId" to userId,
        "date" to date,
    )

    /** Todos los movimientos, del más reciente al más antiguo. */
    suspend fun findAll(): List<Movement> =
        ref().read().children
            .mapNotNull { child -> child.asNode()?.let { fromNode(child.key, it) } }
            .sortedByDescending { it.date }

    fun newId(): String = ref().push().key ?: Instant.now().toEpochMilli().toString()

    suspend fun save(movement: Movement) {
        ref().child(movement.id).setValueAsync(movement.toNode()).await()
    }
}
