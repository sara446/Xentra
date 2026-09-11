const tipoMovimientoInput = document.getElementById("tipoMovimiento");

const botonesTipo = document.querySelectorAll(".movement-type-button");

botonesTipo.forEach(function (boton) {

    boton.addEventListener("click", function () {
        botonesTipo.forEach(function (b) {
            b.classList.remove("selected");
        });
        boton.classList.add("selected");
        tipoMovimientoInput.value = boton.dataset.tipo;
    });
});


const registrarMovimientoForm = document.getElementById("registrarMovimientoForm");

const modal = document.getElementById("modalMensaje");

const modalBoton = document.getElementById("modalBoton");

registrarMovimientoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const producto = document.getElementById("productoMovimiento").value;
    const tipo = tipoMovimientoInput.value;
    const cantidad = document.getElementById("cantidadMovimiento").value;
    document.getElementById("modalProducto").textContent = producto;
    document.getElementById("modalTipo").textContent =
        tipo === "entrada" ? "Entrada" : "Salida";
    document.getElementById("modalCantidad").textContent = cantidad + " u";

    modal.classList.add("show");

});


modalBoton.addEventListener("click", function () {

    window.location.href = "movimientos.html";

});