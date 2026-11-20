package com.xentra.controller

import com.xentra.config.badRequest
import com.xentra.config.conflict
import com.xentra.config.notFound
import com.xentra.model.CATEGORIES
import com.xentra.model.Product
import com.xentra.model.ProductInput
import com.xentra.model.ProductModel
import java.time.Instant

// ============================================================
// CONTROLADOR: Productos
// Valida los datos y aplica las reglas antes de usar el modelo.
// ============================================================

object ProductController {
    private const val MAX_IMAGE_LENGTH = 2_000_000 // ~1.5 MB de imagen en base64

    suspend fun getAll(): List<Product> = ProductModel.findAll()

    suspend fun getById(id: String): Product =
        ProductModel.findById(id) ?: notFound("Producto no encontrado.")

    suspend fun create(input: ProductInput): Product {
        val data = validate(input)
        ensureUniqueCode(data.code, exceptId = null)
        val product = data.copy(id = ProductModel.newId(), createdAt = Instant.now().toString())
        ProductModel.save(product)
        return product
    }

    suspend fun update(id: String, input: ProductInput): Product {
        val current = getById(id)
        // Si un campo no viene en la petición, se conserva el valor actual.
        val merged = ProductInput(
            name = input.name ?: current.name,
            code = input.code ?: current.code,
            category = input.category ?: current.category,
            stock = input.stock ?: current.stock,
            minStock = input.minStock ?: current.minStock,
            location = input.location ?: current.location,
            image = input.image, // null = quitar imagen
        )
        val data = validate(merged)
        ensureUniqueCode(data.code, exceptId = id)
        val product = data.copy(id = id, createdAt = current.createdAt, updatedAt = Instant.now().toString())
        ProductModel.save(product)
        return product
    }

    suspend fun delete(id: String) {
        getById(id) // 404 si no existe
        ProductModel.delete(id)
    }

    private suspend fun ensureUniqueCode(code: String, exceptId: String?) {
        val exists = ProductModel.findAll().any { it.code.equals(code, ignoreCase = true) && it.id != exceptId }
        if (exists) conflict("Ya existe un producto con ese código.", field = "code")
    }

    /** Valida y limpia los datos. Devuelve un producto "plantilla" (sin id ni fecha). */
    private fun validate(input: ProductInput): Product {
        val name = input.name?.trim().orEmpty()
        val code = input.code?.trim().orEmpty()
        val stock = input.stock
        val minStock = input.minStock
        if (name.isEmpty()) badRequest("Ingresa el nombre del producto.", "name")
        if (code.isEmpty()) badRequest("Ingresa el código o referencia.", "code")
        if (stock == null || stock < 0) badRequest("La cantidad no es válida.", "stock")
        if (minStock == null || minStock < 0) badRequest("El stock mínimo no es válido.", "minStock")
        val image = input.image?.takeIf { it.isNotBlank() }
        if (image != null && image.length > MAX_IMAGE_LENGTH) {
            badRequest("La imagen es muy pesada. Elige una más liviana.", "image")
        }
        return Product(
            id = "",
            name = name,
            code = code,
            category = input.category?.takeIf { it in CATEGORIES } ?: CATEGORIES[0],
            stock = stock,
            minStock = minStock,
            location = input.location?.trim().orEmpty(),
            image = image,
            createdAt = "",
        )
    }
}
