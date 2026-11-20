package com.xentra.view

import com.xentra.controller.AuthController
import com.xentra.controller.UserController
import com.xentra.model.RegisterInput
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post

/**
 * POST /api/auth/register  → registro público (sin sesión)
 * GET  /api/me             → perfil del usuario logueado
 * El login lo hace la app directamente con Firebase Authentication.
 */
fun Route.authView() {
    post("/auth/register") {
        val body = call.receive<RegisterInput>()
        call.respond(HttpStatusCode.Created, UserController.register(body))
    }
    get("/me") {
        call.respond(AuthController.currentUser(call))
    }
}
