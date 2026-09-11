const registrarProductoForm =
    document.getElementById("registrarProductoForm");

registrarProductoForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const nombre =
        document.getElementById("nombreProducto").value.trim();

    const codigo =
        document.getElementById("codigoProducto").value.trim();

    const categoria =
        document.getElementById("categoriaProducto").value;

    const cantidadInicial =
        document.getElementById("cantidadInicial").value;

    const stockMinimo =
        document.getElementById("stockMinimo").value;

    const ubicacion =
        document.getElementById("ubicacionProducto").value.trim();

    if (Number(cantidadInicial) < 0 || Number(stockMinimo) < 0) {

        alert("La cantidad y el stock mínimo no pueden ser negativos.");

        return;
    }

    console.log("Producto registrado:");
    console.log("Nombre:", nombre);
    console.log("Código:", codigo);
    console.log("Categoría:", categoria);
    console.log("Cantidad inicial:", cantidadInicial);
    console.log("Stock mínimo:", stockMinimo);
    console.log("Ubicación:", ubicacion);

    alert("Producto guardado correctamente.");

    window.location.href = "inventario.html";

});