package com.xentra.config

/**
 * Configuración del servidor.
 * Cada valor se puede cambiar con una variable de entorno; si no existe, se usa el valor por defecto.
 */
object AppConfig {
    /** Puerto HTTP del backend. */
    val port: Int = env("PORT")?.toIntOrNull() ?: 8080

    /** Ruta al archivo JSON de la cuenta de servicio de Firebase (Admin SDK). */
    val credentialsPath: String = env("FIREBASE_CREDENTIALS") ?: "serviceAccountKey.json"

    /** URL de Firebase Realtime Database. */
    val databaseUrl: String = env("FIREBASE_DATABASE_URL")
        ?: "https://xentra-5811a-default-rtdb.firebaseio.com"

    /** Si es true y no hay productos, carga datos de ejemplo al arrancar. */
    val seedDemoData: Boolean = env("SEED_DEMO_DATA")?.lowercase() != "false"

    private fun env(name: String): String? = System.getenv(name)?.takeIf { it.isNotBlank() }
}
