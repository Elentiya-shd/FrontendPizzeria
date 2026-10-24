let siguienteId = 4;

let pedidos = [
    {
        id: 1,
        cliente: "Andrea López",
        detalle: "Pizza de pepperoni grande",
        hora: "14:05",
        creadoEn: Date.now() - 5 * 60 * 1000,
        estado: "EN_PREPARACION"
    },
    {
        id: 2,
        cliente: "Carlos Pérez",
        detalle: "Pizza hawaiana mediana",
        hora: "14:10",
        creadoEn: Date.now() - 25 * 60 * 1000,
        estado: "LISTO"
    },
    {
        id: 3,
        cliente: "Andrea López",
        detalle: "Pizza de queso grande",
        hora: "14:15",
        creadoEn: Date.now() - 35 * 60 * 1000,
        estado: "ENTREGADO"
    }
];

// ============================================
// ELEMENTOS DEL HTML
// ============================================

const tablaPedidos = document.getElementById("tablaPedidos");
const buscarPedido = document.getElementById("buscarPedido");
const filtroEstado = document.getElementById("filtroEstado");
const mensajeVacio = document.getElementById("mensajeVacio");

const dialogNuevoPedido = document.getElementById("dialogNuevoPedido");
const formNuevoPedido = document.getElementById("formNuevoPedido");

const btnNuevoPedido = document.getElementById("btnNuevoPedido");
const btnCerrarDialogo = document.getElementById("btnCerrarDialogo");
const btnCancelar = document.getElementById("btnCancelar");

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function obtenerNombreEstado(estado) {
    const nombres = {
        EN_PREPARACION: "En preparación",
        LISTO: "Listo",
        ENTREGADO: "Entregado"
    };

    return nombres[estado] || estado;
}

function obtenerClaseEstado(estado) {
    const clases = {
        EN_PREPARACION: "status-preparacion",
        LISTO: "status-listo",
        ENTREGADO: "status-entregado"
    };

    return clases[estado] || "";
}

function obtenerTiempoRestante(pedido) {
    if (pedido.estado === "LISTO") {
        return "Listo";
    }

    if (pedido.estado === "ENTREGADO") {
        return "Entregado";
    }

    // El tiempo real lo proporcionará cocina mediante el backend.
    return "Pendiente de cocina";
}

function actualizarResumen() {
    document.getElementById("totalPedidos").textContent =
        pedidos.length;

    document.getElementById("pedidosPreparacion").textContent =
        pedidos.filter(pedido =>
            pedido.estado === "EN_PREPARACION"
        ).length;

    document.getElementById("pedidosListos").textContent =
        pedidos.filter(pedido =>
            pedido.estado === "LISTO"
        ).length;

    document.getElementById("pedidosEntregados").textContent =
        pedidos.filter(pedido =>
            pedido.estado === "ENTREGADO"
        ).length;
}

function crearCelda(texto, clase = "") {
    const celda = document.createElement("td");

    // textContent evita interpretar el contenido como HTML.
    celda.textContent = texto;

    if (clase) {
        celda.className = clase;
    }

    return celda;
}

// ============================================
// MOSTRAR Y FILTRAR PEDIDOS
// ============================================

function renderizarPedidos() {
    const busqueda = buscarPedido.value.trim().toLowerCase();
    const estadoSeleccionado = filtroEstado.value;

    const pedidosFiltrados = pedidos.filter(pedido => {
        const coincideBusqueda =
            String(pedido.id).includes(busqueda) ||
            pedido.cliente.toLowerCase().includes(busqueda) ||
            pedido.detalle.toLowerCase().includes(busqueda);

        const coincideEstado =
            estadoSeleccionado === "TODOS" ||
            pedido.estado === estadoSeleccionado;

        return coincideBusqueda && coincideEstado;
    });

    tablaPedidos.replaceChildren();

    pedidosFiltrados.forEach(pedido => {
        const fila = document.createElement("tr");

        const folio = `PED-${String(pedido.id).padStart(4, "0")}`;

        fila.appendChild(crearCelda(`#${folio}`, "order-id"));
        fila.appendChild(crearCelda(pedido.cliente));
        fila.appendChild(crearCelda(pedido.detalle));
        fila.appendChild(crearCelda(pedido.hora));
        fila.appendChild(crearCelda(obtenerTiempoRestante(pedido)));

        const celdaEstado = document.createElement("td");
        const etiquetaEstado = document.createElement("span");

        etiquetaEstado.className =
            `status ${obtenerClaseEstado(pedido.estado)}`;

        etiquetaEstado.textContent =
            obtenerNombreEstado(pedido.estado);

        celdaEstado.appendChild(etiquetaEstado);
        fila.appendChild(celdaEstado);

        const celdaAccion = document.createElement("td");
        const botonAccion = document.createElement("button");

        botonAccion.type = "button";
        botonAccion.className = "btn-action";

        if (pedido.estado === "LISTO") {
            botonAccion.textContent = "Confirmar entrega";

            botonAccion.addEventListener("click", () => {
                confirmarEntrega(pedido.id);
            });
        } else if (pedido.estado === "ENTREGADO") {
            botonAccion.textContent = "Entregado";
            botonAccion.disabled = true;
        } else {
            botonAccion.textContent = "En preparación";
            botonAccion.disabled = true;
        }

        celdaAccion.appendChild(botonAccion);
        fila.appendChild(celdaAccion);

        tablaPedidos.appendChild(fila);
    });

    mensajeVacio.hidden = pedidosFiltrados.length > 0;

    actualizarResumen();
}

// ============================================
// CONFIRMAR ENTREGA
// ============================================

function confirmarEntrega(id) {
    const pedido = pedidos.find(pedido => pedido.id === id);

    if (!pedido || pedido.estado !== "LISTO") {
        return;
    }

    const folio = `PED-${String(id).padStart(4, "0")}`;

    const confirmar = window.confirm(
        `¿Confirmas que se entregó el pedido ${folio}?`
    );

    if (!confirmar) {
        return;
    }

    pedido.estado = "ENTREGADO";

    renderizarPedidos();
}

// ============================================
// FORMULARIO DE NUEVO PEDIDO
// ============================================

function abrirFormulario() {
    formNuevoPedido.reset();

    dialogNuevoPedido.showModal();

    document.getElementById("nombreCliente").focus();
}

function cerrarFormulario() {
    dialogNuevoPedido.close();
}

btnNuevoPedido.addEventListener("click", abrirFormulario);

btnCerrarDialogo.addEventListener("click", cerrarFormulario);

btnCancelar.addEventListener("click", cerrarFormulario);

// ============================================
// EVENTOS DE BÚSQUEDA Y FILTRADO
// ============================================

buscarPedido.addEventListener("input", renderizarPedidos);

filtroEstado.addEventListener("change", renderizarPedidos);

// ============================================
// REGISTRAR NUEVO PEDIDO
// ============================================

formNuevoPedido.addEventListener("submit", event => {
    event.preventDefault();

    const cliente = document
        .getElementById("nombreCliente")
        .value
        .trim();

    const detalle = document
        .getElementById("detallePedido")
        .value
        .trim();

    if (!cliente || !detalle) {
        window.alert(
            "Ingresa el nombre del cliente y el detalle del pedido."
        );
        return;
    }

    const nuevoPedido = {
        id: siguienteId++,
        cliente,
        detalle,
        hora: new Date().toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }),
        creadoEn: Date.now(),
        estado: "EN_PREPARACION"
    };

    pedidos.unshift(nuevoPedido);

    cerrarFormulario();
    renderizarPedidos();
});

// ============================================
// INICIALIZAR MÓDULO
// ============================================

renderizarPedidos();