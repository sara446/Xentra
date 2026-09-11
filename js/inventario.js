const buscador = document.getElementById("buscarProducto");
const productos = document.querySelectorAll(".inventory-item");
const filtros = document.querySelectorAll(".inventory-filter");
const inventarioVacio = document.getElementById("inventarioVacio");
let filtroActual = "todos";
function filtrarProductos() {
    const texto = buscador.value.toLowerCase().trim();
    let encontrados = 0;
    productos.forEach(function (producto) {
        const nombre = producto.querySelector("h2").textContent.toLowerCase();
        const informacion = producto.querySelector("p").textContent.toLowerCase();
        let coincideBusqueda = true;
        if (filtroActual === "nombre") {
            coincideBusqueda = nombre.includes(texto);
        } else if (filtroActual === "codigo") {
            const codigo = informacion.split("•")[0].trim();
            coincideBusqueda = codigo.includes(texto);
        } else if (filtroActual === "categoria") {
            const categoria = informacion.split("•")[1]?.trim() || "";
            coincideBusqueda = categoria.includes(texto);
        } else {
            coincideBusqueda = nombre.includes(texto) || informacion.includes(texto);
        }
        if (coincideBusqueda) {
            producto.style.display = "block";
            encontrados++;
        } else {
            producto.style.display = "none";
        }
    });
    if (encontrados === 0) {
        inventarioVacio.classList.add("show");
    } else {
        inventarioVacio.classList.remove("show");
    }
}
buscador.addEventListener("input", filtrarProductos);
filtros.forEach(function (filtro) {
    filtro.addEventListener("click", function () {
        filtros.forEach(function (boton) {
            boton.classList.remove("active");
        });
        filtro.classList.add("active");
        filtroActual = filtro.dataset.filter;
        filtrarProductos();
    });
});