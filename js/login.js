// =========================================
// ELEMENTOS DEL FORMULARIO
// =========================================

const loginForm = document.getElementById("loginForm");

const passwordInput = document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");


// =========================================
// ELEMENTOS DEL MODAL
// =========================================

const modal =
    document.getElementById("modalMensaje");

const modalBox =
    document.querySelector(".modal-box");

const modalIcono =
    document.getElementById("modalIcono");

const modalTitulo =
    document.getElementById("modalTitulo");

const modalMensajeTexto =
    document.getElementById("modalMensajeTexto");

const modalBoton =
    document.getElementById("modalBoton");


// =========================================
// MOSTRAR / OCULTAR CONTRASEÑA
// =========================================

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerHTML =
            '<i class="bi bi-eye-slash"></i>';

    } else {

        passwordInput.type = "password";

        togglePassword.innerHTML =
            '<i class="bi bi-eye"></i>';

    }

});


// =========================================
// MOSTRAR MODAL
// =========================================

function mostrarModal(tipo) {

    modal.classList.add("show");


    // =====================================
    // LOGIN CORRECTO
    // =====================================

    if (tipo === "exito") {

        modalBox.classList.remove("error");

        modalIcono.innerHTML =
            '<i class="bi bi-check-lg"></i>';

        modalTitulo.textContent =
            "Inicio exitoso";

        modalMensajeTexto.textContent =
            "Bienvenido a Xentra.";

        modalBoton.textContent =
            "OK";

    }


    // =====================================
    // LOGIN INCORRECTO
    // =====================================

    else {

        modalBox.classList.add("error");

        modalIcono.innerHTML =
            '<i class="bi bi-exclamation-lg"></i>';

        modalTitulo.textContent =
            "Contraseña incorrecta";

        modalMensajeTexto.textContent =
            "Verifica tus credenciales e inténtalo nuevamente.";

        modalBoton.textContent =
            "Volver a intentarlo";

    }

}


// =========================================
// CERRAR MODAL
// =========================================

function cerrarModal() {

    modal.classList.remove("show");

}


// =========================================
// LOGIN
// =========================================

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const usuario =
        document.getElementById("usuario").value.trim();


    const password =
        document.getElementById("password").value.trim();


    // =====================================
    // VALIDAR CAMPOS
    // =====================================

    if (usuario === "" || password === "") {

        return;

    }


    // =====================================
    // CREDENCIALES DE PRUEBA
    // =====================================

    if (
        usuario === "soporte@xentra.com" &&
        password === "123456"
    ) {

        mostrarModal("exito");

    } else {

        mostrarModal("error");

    }

});


// =========================================
// BOTÓN DEL MODAL
// =========================================

modalBoton.addEventListener("click", function () {


    // =====================================
    // SI EL LOGIN FUE CORRECTO
    // =====================================

    if (!modalBox.classList.contains("error")) {

        window.location.href = "principal.html";

    }


    // =====================================
    // SI EL LOGIN FUE INCORRECTO
    // =====================================

    else {

        cerrarModal();

        passwordInput.value = "";

        passwordInput.focus();

    }

});