package com.xentra.controller

import com.xentra.config.badRequest
import com.xentra.model.Movement
import com.xentra.model.MovementInput
import com.xentra.model.MovementModel
import com.xentra.model.MovementTypes
import com.xentra.model.ProductModel
import com.xentra.model.User
import java.time.Instant

// ============================================================
// CONTROLADOR: Movimientos
// Registra entradas/salidas y actualiza el stock del producto.
// ============================================================

object MovementController {

    /** Historial, opcionalmente filtrado por tipo ("entrada" o "salida"). */
    suspend fun getAll(type: String? = null): List<Movement> =
        MovementModel.findAll().filter { type == null || it.type == type }

    suspend fun create(input: MovementInput, by: User): Movement {
        val productId = input.productId?.trim().orEmpty()
        val type = input.type?.takeIf { it == MovementTypes.IN || it == MovementTypes.OUT }
        val qty = input.quantity ?: 0

        if (productId.isEmpty()) badRequest("Selecciona un producto.", "productId")
        if (type == null) badRequest("El tipo de movimiento no es válido.", "type")
        if (qty <= 0) badRequest("Ingresa una cantidad válida.", "quantity")

        val product = ProductController.getById(productId)

        // Entrada suma, salida resta. El modelo no deja el stock en negativo.
        val delta = if (type == MovementTypes.IN) qty else -qty
        val change = ProductModel.changeStock(product.id, delta)
        if (!change.saved) badRequest("Solo hay ${change.stockBefore} unidades disponibles.", "quantity")

        val movement = Movement(
            id = MovementModel.newId(),
            productId = product.id,
            productName = product.name,
            productCode = product.code,
            type = type,
            quantity = qty,
            note = input.note?.trim().orEmpty(),
            user = by.name.ifBlank { by.email },
            userId = by.id,
            date = Instant.now().toString(),
        )
        MovementModel.save(movement)
        return movement
    }
}
