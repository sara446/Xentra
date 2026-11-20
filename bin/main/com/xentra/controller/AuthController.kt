package com.xentra.controller

import com.xentra.config.forbidden
import com.xentra.config.unauthorized
import com.xentra.model.User
import com.xentra.model.UserModel
import io.ktor.http.HttpHeaders
import io.ktor.server.application.ApplicationCall

// ============================================================
// CONTROLADOR: Autenticación
// La app inicia sesión con Firebase Auth y envía su token en
// "Authorization: Bearer <token>". Aquí se verifica en cada petición.
// ============================================================

object AuthController {

    /** Usuario que hace la petición. Responde 401 si no hay sesión y 403 si está inactivo. */
    suspend fun currentUser(call: ApplicationCall): User {
        val header = call.request.headers[HttpHeaders.Authorization]
        val token = header?.takeIf { it.startsWith("Bearer ", ignoreCase = true) }?.substring(7)?.trim()
        if (token.isNullOrEmpty()) unauthorized("Debes iniciar sesión.")

        val decoded = UserModel.verifyToken(token) ?: unauthorized()
        val user = UserController.getOrCreateProfile(decoded.uid, decoded.email, decoded.name)
        if (!user.active) forbidden("Tu usuario está inactivo. Contacta al administrador.")
        return user
    }

    /** Igual que [currentUser], pero además exige rol de Administrador. */
    suspend fun requireAdmin(call: ApplicationCall): User {
        val user = currentUser(call)
        if (!user.isAdmin) forbidden("Solo un administrador puede hacer esta acción.")
        return user
    }
}
