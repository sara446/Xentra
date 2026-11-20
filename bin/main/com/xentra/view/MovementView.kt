package com.xentra.view

import com.xentra.controller.AuthController
import com.xentra.controller.MovementController
import com.xentra.model.MovementInput
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route

/**
 * GET  /api/movements?type=entrada|salida  → historial (más reciente primero)
 * POST /api/movements                      → registrar entrada o salida
 */
fun Route.movementView() = route("/movements") {
    get {
        AuthController.currentUser(call)
        call.respond(MovementController.getAll(call.request.queryParameters["type"]))
    }
    post {
        val user = AuthController.currentUser(call)
        val body = call.receive<MovementInput>()
        call.respond(HttpStatusCode.Created, MovementController.create(body, user))
    }
}
