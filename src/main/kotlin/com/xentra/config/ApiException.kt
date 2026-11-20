package com.xentra.config

import io.ktor.http.HttpStatusCode

/**
 * Error controlado de la API. Se convierte en una respuesta JSON:
 * { "message": "...", "field": "email" }
 */
class ApiException(
    val status: HttpStatusCode,
    override val message: String,
    val field: String? = null,
) : RuntimeException(message)

fun badRequest(message: String, field: String? = null): Nothing =
    throw ApiException(HttpStatusCode.BadRequest, message, field)

fun notFound(message: String): Nothing = throw ApiException(HttpStatusCode.NotFound, message)

fun conflict(message: String, field: String? = null): Nothing =
    throw ApiException(HttpStatusCode.Conflict, message, field)

fun unauthorized(message: String = "Tu sesión expiró. Inicia sesión de nuevo."): Nothing =
    throw ApiException(HttpStatusCode.Unauthorized, message)

fun forbidden(message: String): Nothing = throw ApiException(HttpStatusCode.Forbidden, message)
