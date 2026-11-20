package com.xentra.controller

import com.xentra.config.badRequest
import com.xentra.config.conflict
import com.xentra.config.notFound
import com.xentra.model.CreateUserInput
import com.xentra.model.EmailAlreadyExistsException
import com.xentra.model.RegisterInput
import com.xentra.model.Roles
import com.xentra.model.User
import com.xentra.model.UserModel

// ============================================================
// CONTROLADOR: Usuarios
// Registro, creación por el administrador, perfil y activar/desactivar.
// ============================================================

object UserController {
    private val EMAIL_REGEX = Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")

    suspend fun getAll(): List<User> = UserModel.findAll()

    /** Registro público: el primer usuario del sistema es Administrador; el resto, Empleado. */
    suspend fun register(input: RegisterInput): User {
        val role = if (UserModel.existsAdmin()) Roles.EMPLOYEE else Roles.ADMIN
        return createUser(input.name, input.email, input.password, role)
    }

    /** Creación desde Gestión de usuarios: el administrador elige el rol. */
    suspend fun createByAdmin(input: CreateUserInput): User {
        val role = input.role ?: Roles.EMPLOYEE
        if (role !in Roles.ALL) badRequest("El rol no es válido.", "role")
        return createUser(input.name, input.email, input.password, role)
    }

    /**
     * Perfil del usuario que inició sesión. Si tiene cuenta en Firebase Auth pero
     * aún no tiene perfil (cuentas creadas antes del backend), se crea.
     */
    suspend fun getOrCreateProfile(uid: String, email: String?, displayName: String?): User {
        UserModel.findById(uid)?.let { return it }
        val user = User(
            id = uid,
            name = displayName?.takeIf { it.isNotBlank() } ?: email?.substringBefore("@").orEmpty(),
            email = email.orEmpty(),
            role = if (UserModel.existsAdmin()) Roles.EMPLOYEE else Roles.ADMIN,
            active = true,
        )
        UserModel.save(user)
        return user
    }

    /** Activa o desactiva. Un usuario desactivado no puede iniciar sesión. */
    suspend fun toggleActive(uid: String, requestedBy: User): User {
        if (uid == requestedBy.id) badRequest("No puedes desactivar tu propia cuenta.")
        val current = UserModel.findById(uid) ?: notFound("Usuario no encontrado.")
        val updated = current.copy(active = !current.active)
        UserModel.setActive(uid, updated.active)
        UserModel.setAccountDisabled(uid, disabled = !updated.active)
        return updated
    }

    private suspend fun createUser(name: String?, email: String?, password: String?, role: String): User {
        val cleanName = name?.trim().orEmpty()
        val cleanEmail = email?.trim()?.lowercase().orEmpty()
        val pass = password.orEmpty()

        if (cleanName.length < 3) badRequest("El nombre debe tener al menos 3 caracteres.", "name")
        if (!EMAIL_REGEX.matches(cleanEmail)) badRequest("Ingresa un correo válido.", "email")
        if (pass.length < 6) badRequest("La contraseña debe tener al menos 6 caracteres.", "password")

        val uid = try {
            UserModel.createAccount(cleanName, cleanEmail, pass)
        } catch (e: EmailAlreadyExistsException) {
            conflict("Ya existe una cuenta con este correo.", "email")
        }

        val user = User(id = uid, name = cleanName, email = cleanEmail, role = role, active = true)
        UserModel.save(user)
        return user
    }
}
