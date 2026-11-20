package com.xentra.controller

import com.xentra.model.DashboardSummary
import com.xentra.model.MovementTypes
import java.time.Instant
import java.time.temporal.ChronoUnit

// ============================================================
// CONTROLADOR: Panel de inicio
// Totales de productos, stock bajo y movimientos de los últimos 7 días.
// ============================================================

object DashboardController {

    suspend fun getSummary(): DashboardSummary {
        val products = ProductController.getAll()
        val weekAgo = Instant.now().minus(7, ChronoUnit.DAYS)
        val recent = MovementController.getAll().filter { m ->
            runCatching { Instant.parse(m.date) }.getOrNull()?.isAfter(weekAgo) == true
        }
        return DashboardSummary(
            totalProducts = products.size,
            lowStock = products.count { it.isLowStock },
            recentIn = recent.count { it.type == MovementTypes.IN },
            recentOut = recent.count { it.type == MovementTypes.OUT },
        )
    }
}
