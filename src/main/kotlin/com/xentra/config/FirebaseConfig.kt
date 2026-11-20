package com.xentra.config

import com.google.api.core.ApiFuture
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.MutableData
import com.google.firebase.database.Transaction
import com.google.firebase.database.ValueEventListener
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import org.slf4j.LoggerFactory
import java.io.File
import java.io.FileInputStream
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

/**
 * Conexión con Firebase usando el Admin SDK.
 * El Admin SDK tiene permisos totales, por eso solo vive en el backend.
 */
object FirebaseService {
    private val log = LoggerFactory.getLogger(FirebaseService::class.java)

    lateinit var auth: FirebaseAuth
        private set
    lateinit var database: FirebaseDatabase
        private set

    fun init() {
        if (FirebaseApp.getApps().isNotEmpty()) return

        val file = File(AppConfig.credentialsPath)
        require(file.exists()) {
            """
            No se encontró la clave de Firebase en: ${file.absolutePath}
            Descárgala en Firebase Console → Configuración del proyecto → Cuentas de servicio
            → "Generar nueva clave privada", y guárdala como serviceAccountKey.json en la raíz del proyecto (junto a package.json).
            """.trimIndent()
        }

        val options = FileInputStream(file).use { stream ->
            FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(stream))
                .setDatabaseUrl(AppConfig.databaseUrl)
                .build()
        }
        val app = FirebaseApp.initializeApp(options)
        auth = FirebaseAuth.getInstance(app)
        database = FirebaseDatabase.getInstance(app)
        log.info("Firebase conectado: {}", AppConfig.databaseUrl)
    }

    fun ref(path: String): DatabaseReference = database.getReference(path)
}

// ---------- Utilidades para usar Realtime Database con corrutinas ----------

/** Lee un nodo una sola vez. */
suspend fun DatabaseReference.read(): DataSnapshot = suspendCancellableCoroutine { cont ->
    addListenerForSingleValueEvent(object : ValueEventListener {
        override fun onDataChange(snapshot: DataSnapshot) {
            if (cont.isActive) cont.resume(snapshot)
        }

        override fun onCancelled(error: DatabaseError) {
            if (cont.isActive) cont.resumeWithException(error.toException())
        }
    })
}

/** Espera el resultado de una operación asíncrona del Admin SDK. */
suspend fun <T> ApiFuture<T>.await(): T = withContext(Dispatchers.IO) { get() }

/**
 * Ejecuta una transacción atómica sobre un nodo.
 * Devuelve true si se guardó, false si [handler] la canceló (Transaction.abort()).
 */
suspend fun DatabaseReference.transaction(handler: (MutableData) -> Transaction.Result): Boolean =
    suspendCancellableCoroutine { cont ->
        runTransaction(object : Transaction.Handler {
            override fun doTransaction(currentData: MutableData): Transaction.Result = handler(currentData)

            override fun onComplete(error: DatabaseError?, committed: Boolean, snapshot: DataSnapshot?) {
                if (!cont.isActive) return
                if (error != null) cont.resumeWithException(error.toException())
                else cont.resume(committed)
            }
        })
    }

/** Datos de un nodo de Realtime Database. */
typealias Node = Map<String, Any?>

/** Devuelve el nodo como mapa, o null si no existe o no es un objeto. */
@Suppress("UNCHECKED_CAST")
fun DataSnapshot.asNode(): Node? = value as? Map<String, Any?>

/** Convierte un campo del nodo en texto/número de forma segura. */
fun Node.str(key: String, default: String = ""): String = this[key]?.toString() ?: default
fun Node.int(key: String, default: Int = 0): Int = when (val v = this[key]) {
    is Number -> v.toInt()
    is String -> v.toIntOrNull() ?: default
    else -> default
}
fun Node.bool(key: String, default: Boolean): Boolean = when (val v = this[key]) {
    is Boolean -> v
    is String -> v.toBooleanStrictOrNull() ?: default
    else -> default
}
