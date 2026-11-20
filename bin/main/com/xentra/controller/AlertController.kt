package com.xentra.controller

import com.xentra.model.Product

// ============================================================
// CONTROLADOR: Alertas
// Productos cuyo stock está por debajo del mínimo.
// ============================================================

object AlertController {
    suspend fun getLowStock(): List<Product> = ProductController.getAll().filter { it.isLowStock }
}
