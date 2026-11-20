package com.xentra.view

import com.xentra.model.HealthResponse
import io.ktor.server.application.Application
import io.ktor.server.response.respond
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import java.time.Instant

// ============================================================
// VISTA (API): en un backend, la "vista" es la respuesta JSON que
// recibe la app. Cada archivo de esta carpeta expone un módulo:
// recibe la petición → llama al controlador → responde en JSON.
// ============================================================

fun Application.configureViews() {
    routing {
        // Comprobar que el servidor está encendido: http://localhost:8080/health
        get("/") { call.respond(HealthResponse("ok", "Xentra API", Instant.now().toString())) }
        get("/health") { call.respond(HealthResponse("ok", "Xentra API", Instant.now().toString())) }

        route("/api") {
            authView()
            productView()
            movementView()
            alertView()
            dashboardView()
            userView()
        }
    }
}
