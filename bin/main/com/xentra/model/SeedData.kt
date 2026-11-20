package com.xentra.model

import com.xentra.config.AppConfig
import org.slf4j.LoggerFactory
import java.time.Instant
import java.time.temporal.ChronoUnit

/**
 * Datos de ejemplo (los mismos que tenía mockDb.js).
 * Se cargan solo si la base de datos todavía no tiene productos.
 * Para desactivarlo: variable de entorno SEED_DEMO_DATA=false
 */
object SeedData {
    private val log = LoggerFactory.getLogger(SeedData::class.java)

    private fun img(keyword: String, lock: Int) = "https://loremflickr.com/400/400/$keyword?lock=$lock"
    private fun daysAgo(n: Long) = Instant.now().minus(n, ChronoUnit.DAYS).truncatedTo(ChronoUnit.SECONDS).toString()

    suspend fun loadIfEmpty() {
        if (!AppConfig.seedDemoData || !ProductModel.isEmpty()) return

        val products = listOf(
            Product("p1", "Laptop Dell Vostro 3400", "TEC-DEL-3400", "Tecnología", 15, 5, "Estante A-10", img("laptop", 1), "2026-01-10T10:00:00Z"),
            Product("p2", "Mouse Inalámbrico Logitech", "ACC-LOG-M185", "Accesorios de Oficina", 3, 10, "Estante B-12", img("computer,mouse", 2), "2026-01-14T10:00:00Z"),
            Product("p3", "Monitor LG Pro 27\"", "TEC-LGP-27", "Tecnología", 8, 2, "Estante A-04", img("monitor,desk", 3), "2026-01-12T10:00:00Z"),
            Product("p4", "Cable HDMI 4K 1.8m", "ACC-CAB-HDMI", "Accesorios", 1, 15, "Estante A-10", img("cable,hdmi", 4), "2026-01-15T10:00:00Z"),
        )
        products.forEach { ProductModel.save(it) }

        val movements = listOf(
            Movement("m1", "p1", "Laptop Dell Vostro 3400", "TEC-DEL-3400", MovementTypes.IN, 10, "", "Administrador", null, daysAgo(0)),
            Movement("m2", "p2", "Mouse Inalámbrico Logitech", "ACC-LOG-M185", MovementTypes.OUT, 3, "", "Soporte Técnico", null, daysAgo(1)),
            Movement("m3", "p3", "Monitor LG Pro 27\"", "TEC-LGP-27", MovementTypes.IN, 5, "", "Administrador", null, daysAgo(3)),
            Movement("m4", "p4", "Cable HDMI 4K 1.8m", "ACC-CAB-HDMI", MovementTypes.OUT, 15, "", "Soporte Técnico", null, daysAgo(4)),
        )
        movements.forEach { MovementModel.save(it) }

        log.info("Datos de ejemplo cargados: {} productos y {} movimientos", products.size, movements.size)
    }
}
