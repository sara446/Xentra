package com.xentra.config

import com.xentra.model.ErrorResponse
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.BadRequestException
import io.ktor.server.plugins.calllogging.CallLogging
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.cors.routing.CORS
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.request.path
import io.ktor.server.response.respond
import kotlinx.serialization.json.Json
import org.slf4j.event.Level

fun Application.configurePlugins() {
    // JSON
    install(ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = true // el frontend puede mandar campos extra (id, createdAt...)
            encodeDefaults = true
            prettyPrint = false
        })
    }

    // Permite llamadas desde Expo Web (navegador)
    install(CORS) {
        anyHost()
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Options)
    }

    // Muestra cada petición en la consola
    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/api") }
    }

    // Convierte los errores en JSON { "message": "..." }
    install(StatusPages) {
        exception<ApiException> { call, e ->
            call.respond(e.status, ErrorResponse(e.message, e.field))
        }
        exception<BadRequestException> { call, _ ->
            call.respond(HttpStatusCode.BadRequest, ErrorResponse("Los datos enviados no son válidos."))
        }
        exception<Throwable> { call, e ->
            call.application.environment.log.error("Error no controlado", e)
            call.respond(
                HttpStatusCode.InternalServerError,
                ErrorResponse("Ocurrió un error en el servidor. Inténtalo de nuevo."),
            )
        }
    }
}
