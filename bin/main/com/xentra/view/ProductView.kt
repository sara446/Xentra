package com.xentra.view

import com.xentra.controller.AuthController
import com.xentra.controller.ProductController
import com.xentra.model.ProductInput
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import io.ktor.server.routing.route

/**
 * GET    /api/products        → lista
 * GET    /api/products/{id}   → detalle
 * POST   /api/products        → crear
 * PUT    /api/products/{id}   → editar
 * DELETE /api/products/{id}   → eliminar
 */
fun Route.productView() = route("/products") {
    get {
        AuthController.currentUser(call)
        call.respond(ProductController.getAll())
    }
    get("/{id}") {
        AuthController.currentUser(call)
        call.respond(ProductController.getById(call.parameters["id"].orEmpty()))
    }
    post {
        AuthController.currentUser(call)
        val body = call.receive<ProductInput>()
        call.respond(HttpStatusCode.Created, ProductController.create(body))
    }
    put("/{id}") {
        AuthController.currentUser(call)
        val body = call.receive<ProductInput>()
        call.respond(ProductController.update(call.parameters["id"].orEmpty(), body))
    }
    delete("/{id}") {
        AuthController.currentUser(call)
        ProductController.delete(call.parameters["id"].orEmpty())
        call.respond(HttpStatusCode.NoContent)
    }
}
