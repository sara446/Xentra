package com.xentra.model

import kotlinx.serialization.Serializable

// ============================================================
// MODELO: respuestas generales de la API
// ============================================================

/** Totales del panel de inicio (HomeScreen). */
@Serializable
data class DashboardSummary(
    val totalProducts: Int,
    val lowStock: Int,
    val recentIn: Int,
    val recentOut: Int,
)

/** Formato de todos los errores: { "message": "...", "field": "email" } */
@Serializable
data class ErrorResponse(val message: String, val field: String? = null)

@Serializable
data class HealthResponse(val status: String, val service: String, val time: String)
