package com.xentra.view

import com.xentra.controller.AlertController
import com.xentra.controller.AuthController
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get

/** GET /api/alerts → productos con stock bajo el mínimo */
fun Route.alertView() = get("/alerts") {
    AuthController.currentUser(call)
    call.respond(AlertController.getLowStock())
}
