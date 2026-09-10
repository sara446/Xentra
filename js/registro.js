// =========================================
// MOSTRAR / OCULTAR CONTRASEÑA
// =========================================

function mostrarPassword(id, boton) {

    const password = document.getElementById(id);

    const icono = boton.querySelector("i");


    if (password.type === "password") {

        password.type = "text";

        icono.classList.remove("bi-eye");

        icono.classList.add("bi-eye-slash");

    } else {

        password.type = "password";

        icono.classList.remove("bi-eye-slash");

        icono.classList.add("bi-eye");

    }

}


// =========================================
// FORMULARIO DE REGISTRO
// =========================================

const registroForm =
    document.getElementById("registroForm");


registroForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const nombre =
        document.getElementById("nombre").value.trim();


    const correo =
        document.getElementById("correo").value.trim();


    const password =
        document.getElementById("registroPassword").value;


    const confirmarPassword =
        document.getElementById("confirmarPassword").value;


    const rol =
        document.getElementById("rol").value;


    // =====================================
    // VALIDAR CONTRASEÑAS
    // =====================================

    if (password !== confirmarPassword) {

        alert("Las contraseñas no coinciden.");

        return;
    }


    // =====================================
    // VALIDAR LONGITUD
    // =====================================

    if (password.length < 6) {

        alert(
            "La contraseña debe tener al menos 6 caracteres."
        );

        return;
    }


    // =====================================
    // REGISTRO DE PRUEBA
    // =====================================

    console.log("Usuario registrado:");

    console.log("Nombre:", nombre);

    console.log("Correo:", correo);

    console.log("Rol:", rol);


    alert("Cuenta creada correctamente.");


    // Regresar al login

    window.location.href = "index.html";

});