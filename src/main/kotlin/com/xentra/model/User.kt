package com.xentra.model

import com.google.firebase.auth.AuthErrorCode
import com.google.firebase.auth.FirebaseAuthException
import com.google.firebase.auth.FirebaseToken
import com.google.firebase.auth.UserRecord
import com.xentra.config.FirebaseService
import com.xentra.config.Node
import com.xentra.config.asNode
import com.xentra.config.await
import com.xentra.config.bool
import com.xentra.config.read
import com.xentra.config.str
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import java.time.Instant

// ============================================================
// MODELO: Usuario
// La cuenta (correo/contraseña) vive en Firebase Authentication
// y el perfil (nombre, rol, activo) en Realtime Database: /users/{uid}
// ============================================================

/** Mismos textos que usa el frontend (src/models/User.js). */
object Roles {
    const val ADMIN = "Administrador de Inventario"
    const val EMPLOYEE = "Empleado"
    val ALL = listOf(ADMIN, EMPLOYEE)

    /** Convierte valores antiguos ("admin", "employee") al texto oficial. */
    fun normalize(role: String?): String = when {
        role == null -> EMPLOYEE
        role.equals("admin", ignoreCase = true) || role.startsWith("Admin", ignoreCase = true) -> ADMIN
        else -> EMPLOYEE
    }
}

@Serializable
data class User(
    val id: String,
    val name: String,
    val email: String,
    val role: String,
    val active: Boolean,
) {
    val isAdmin: Boolean get() = role == Roles.ADMIN
}

/** Registro público (pantalla "Regístrate"). */
@Serializable
data class RegisterInput(
    val name: String? = null,
    val email: String? = null,
    val password: String? = null,
)

/** Usuario creado por un administrador (Gestión de usuarios). */
@Serializable
data class CreateUserInput(
    val name: String? = null,
    val email: String? = null,
    val password: String? = null,
    val role: String? = null,
)

/** Error al crear la cuenta en Firebase Authentication. */
class EmailAlreadyExistsException : RuntimeException()

object UserModel {
    private const val PATH = "users"
    private fun ref() = FirebaseService.ref(PATH)

    private fun fromNode(id: String, m: Node) = User(
        id = id,
        name = m.str("name"),
        email = m.str("email"),
        role = Roles.normalize(m["role"]?.toString()),
        active = m.bool("active", true),
    )

    private fun User.toNode(): Map<String, Any?> = mapOf(
        "name" to name,
        "email" to email,
        "role" to role,
        "active" to active,
    )

    // ---------- Perfil (Realtime Database) ----------

    suspend fun findAll(): List<User> =
        ref().read().children
            .mapNotNull { child -> child.asNode()?.let { fromNode(child.key, it) } }
            .sortedBy { it.name.lowercase() }

    suspend fun findById(uid: String): User? {
        val node = ref().child(uid).read().asNode() ?: return null
        return fromNode(uid, node)
    }

    suspend fun existsAdmin(): Boolean = findAll().any { it.isAdmin }

    suspend fun save(user: User) {
        ref().child(user.id).setValueAsync(user.toNode() + ("createdAt" to Instant.now().toString())).await()
    }

    suspend fun setActive(uid: String, active: Boolean) {
        ref().child(uid).child("active").setValueAsync(active).await()
    }

    // ---------- Cuenta (Firebase Authentication) ----------

    /** Crea la cuenta y devuelve su uid. Lanza [EmailAlreadyExistsException] si el correo ya existe. */
    suspend fun createAccount(name: String, email: String, password: String): String = try {
        withContext(Dispatchers.IO) {
            FirebaseService.auth.createUser(
                UserRecord.CreateRequest()
                    .setEmail(email)
                    .setPassword(password)
                    .setDisplayName(name)
            ).uid
        }
    } catch (e: FirebaseAuthException) {
        if (e.authErrorCode == AuthErrorCode.EMAIL_ALREADY_EXISTS) throw EmailAlreadyExistsException()
        throw e
    }

    /** Bloquea o desbloquea el inicio de sesión de la cuenta. */
    suspend fun setAccountDisabled(uid: String, disabled: Boolean) {
        try {
            withContext(Dispatchers.IO) {
                FirebaseService.auth.updateUser(UserRecord.UpdateRequest(uid).setDisabled(disabled))
            }
        } catch (e: FirebaseAuthException) {
            // Perfil sin cuenta (datos antiguos): solo se cambia el perfil.
            if (e.authErrorCode != AuthErrorCode.USER_NOT_FOUND) throw e
        }
    }

    /** Verifica el token que envía la app. Devuelve null si no es válido o expiró. */
    suspend fun verifyToken(token: String): FirebaseToken? = try {
        withContext(Dispatchers.IO) { FirebaseService.auth.verifyIdToken(token) }
    } catch (e: FirebaseAuthException) {
        null
    } catch (e: IllegalArgumentException) {
        null
    }
}
