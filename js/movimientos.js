const filtrosMovimientos = document.querySelectorAll("#filtrosMovimientos .inventory-filter");
const listaMovimientos = document.querySelectorAll("#listaMovimientos .inventory-item");
const movimientosVacio = document.getElementById("movimientosVacio");

filtrosMovimientos.forEach(function (filtro) {

    filtro.addEventListener("click", function () {
        filtrosMovimientos.forEach(function (f) {
            f.classList.remove("active");
        });
        filtro.classList.add("active");
        const tipo = filtro.dataset.filter;
        let visibles = 0;
        listaMovimientos.forEach(function (item) {
            const coincide =
                tipo === "todos" || item.dataset.tipo === tipo;
            item.style.display = coincide ? "" : "none";
            if (coincide) {
                visibles++;
            }
        });
        movimientosVacio.classList.toggle("show", visibles === 0);
    });
});