package com.xentra.view

import com.xentra.controller.AuthController
import com.xentra.controller.UserController
import com.xentra.model.CreateUserInput
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import io.ktor.server.routing.route

/**
 * Gestión de usuarios (solo administradores)
 * GET  /api/users              → lista
 * POST /api/users              → crear usuario con rol
 * PUT  /api/users/{id}/toggle  → activar / desactivar
 */
fun Route.userView() = route("/users") {
    get {
        AuthController.requireAdmin(call)
        call.respond(UserController.getAll())
    }
    post {
        AuthController.requireAdmin(call)
        val body = call.receive<CreateUserInput>()
        call.respond(HttpStatusCode.Created, UserController.createByAdmin(body))
    }
    put("/{id}/toggle") {
        val admin = AuthController.requireAdmin(call)
        call.respond(UserController.toggleActive(call.parameters["id"].orEmpty(), admin))
    }
}
