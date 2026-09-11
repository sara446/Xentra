const recuperarForm =
    document.getElementById("recuperarForm");
const correoInput =
    document.getElementById("correoRecuperacion");
const modal =
    document.getElementById("modalRecuperacion");
const modalBoton =
    document.getElementById("modalRecuperacionBoton");

recuperarForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const correo =
        correoInput.value.trim();
    if (correo === "") {
        return;
    }

    modal.classList.add("show");

});


modalBoton.addEventListener("click", function() {
    modal.classList.remove("show");
    window.location.href = "index.html";
});