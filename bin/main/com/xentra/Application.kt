package com.xentra

import com.xentra.config.AppConfig
import com.xentra.config.FirebaseService
import com.xentra.config.configurePlugins
import com.xentra.model.SeedData
import com.xentra.view.configureViews
import io.ktor.server.application.Application
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import java.net.Inet4Address
import java.net.NetworkInterface

// ============================================================
// Punto de entrada del backend (Ktor).
// Arquitectura MVC:
//   model/       → datos y acceso a Firebase
//   controller/  → validaciones y reglas del negocio
//   view/        → endpoints que responden JSON a la app
//   config/      → Firebase, JSON, CORS, errores
// ============================================================

private val log = LoggerFactory.getLogger("Xentra")

fun main() {
    // 1. Conectar con Firebase (Admin SDK)
    FirebaseService.init()

    // 2. Cargar datos de ejemplo si la base está vacía
    runBlocking {
        runCatching { SeedData.loadIfEmpty() }
            .onFailure { log.warn("No se pudieron cargar los datos de ejemplo: {}", it.message) }
    }

    // 3. Mostrar la URL para el .env de la app
    log.info("Xentra API escuchando en el puerto {}", AppConfig.port)
    localIps().forEach { ip ->
        log.info("  → En el .env: EXPO_PUBLIC_API_URL=http://{}:{}/api", ip, AppConfig.port)
    }

    // 4. Iniciar el servidor (0.0.0.0 = accesible desde el celular en la misma Wi-Fi)
    embeddedServer(Netty, port = AppConfig.port, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    configurePlugins()
    configureViews()
}

/** IPs de la red local del computador (para usarlas desde el celular). */
private fun localIps(): List<String> = runCatching {
    NetworkInterface.getNetworkInterfaces().toList()
        .filter { it.isUp && !it.isLoopback && !it.isVirtual }
        .flatMap { it.inetAddresses.toList() }
        .filterIsInstance<Inet4Address>()
        .map { it.hostAddress }
}.getOrDefault(emptyList())
