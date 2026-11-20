package com.xentra.view

import com.xentra.controller.AuthController
import com.xentra.controller.DashboardController
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get

/** GET /api/dashboard → totales del panel de inicio */
fun Route.dashboardView() = get("/dashboard") {
    AuthController.currentUser(call)
    call.respond(DashboardController.getSummary())
}
