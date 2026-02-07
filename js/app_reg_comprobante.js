document.addEventListener("DOMContentLoaded", () => {
    cargarClientesSelect();
    // Intentamos cargar comprobantes si existe el select en esta vista
    cargarComprobantesSelect();

    // Fecha de emisión automática
    const fechaEl = document.getElementById("fechaEmision");
    if (fechaEl) fechaEl.value = new Date().toISOString().split("T")[0];

    // Vincular botón Guardar (más robusto que el onclick inline)
    const btnGuardar = document.getElementById("btnGuardarComprobante");
    if (btnGuardar) btnGuardar.addEventListener("click", registrarComprobante);
});

/* ===============================
   CLIENTES
================================ */

function cargarClientesSelect() {
    const select = document.getElementById("clienteSelect");
    select.innerHTML = `<option value="">-- Seleccione un cliente --</option>`;

    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    clientes.forEach(c => {
        select.innerHTML += `
            <option value="${c.dni}">
                ${c.nombres} ${c.apellidos} - ${c.dni}
            </option>`;
    });
}

// Habilitar comprobante luego de elegir cliente
function habilitarComprobante() {
    const cliente = document.getElementById("clienteSelect").value;

    if (!cliente) {
        alert("⚠️ Seleccione un cliente");
        return;
    }

    const seccionComprobante = document.getElementById("seccionComprobante");
    if (seccionComprobante) seccionComprobante.disabled = false;
}

/* ===============================
   COMPROBANTES
================================ */

function registrarComprobante() {
    const cliente = document.getElementById("clienteSelect").value;
    const tipo = document.getElementById("tipoComprobante").value;
    const total = Number(document.getElementById("totalComprobante").value);
    const fechaVencimiento = document.getElementById("fechaVencimiento").value;

    if (!cliente || !total || !fechaVencimiento) {
        alert("⚠️ Complete todos los datos del comprobante");
        return;
    }

    const comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];

    const comprobante = {
        id: "C-" + Date.now(),
        dniCliente: cliente,
        tipo: tipo,
        total: total,
        fechaEmision: document.getElementById("fechaEmision").value,
        fechaVencimiento: fechaVencimiento,
        estado: "PENDIENTE"
    };

    comprobantes.push(comprobante);
    localStorage.setItem("comprobantes", JSON.stringify(comprobantes));

    cargarComprobantesSelect();
    const seccionPagos = document.getElementById("seccionPagos");
    if (seccionPagos) seccionPagos.disabled = false;

    swal.fire({
        icon: 'success',
        title: '✅ Comprobante registrado',
        text: `Comprobante registrado correctamente.`,
    });
}

// Cargar comprobantes en pagos
function cargarComprobantesSelect() {
    const select = document.getElementById("comprobanteSelect");
    if (!select) return; // Si no existe el select en esta página, no hacemos nada
    select.innerHTML = `<option value="">-- Seleccione comprobante --</option>`;

    const comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];

    comprobantes.forEach(c => {
        select.innerHTML += `
            <option value="${c.id}">
                ${c.id} | ${c.tipo} | S/ ${c.total} | ${c.estado}
            </option>`;
    });
}

/* ===============================
   PAGOS
================================ */

function registrarPago() {
    const idComprobante = document.getElementById("comprobanteSelect").value;
    const monto = Number(document.getElementById("montoPago").value);

    if (!idComprobante || !monto) {
        alert("⚠️ Complete los datos del pago");
        return;
    }

    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];

    const pago = {
        idComprobante: idComprobante,
        monto: monto,
        fechaPago: new Date().toISOString().split("T")[0]
    };

    pagos.push(pago);
    localStorage.setItem("pagos", JSON.stringify(pagos));

    actualizarEstadoComprobante(idComprobante);
    cargarComprobantesSelect();

    alert("💰 Pago registrado");
}

/* ===============================
   ESTADOS Y VENCIMIENTOS
================================ */

function actualizarEstadoComprobante(id) {
    let comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];
    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];

    const totalPagado = pagos
        .filter(p => p.idComprobante === id)
        .reduce((s, p) => s + p.monto, 0);

    comprobantes = comprobantes.map(c => {
        if (c.id === id && totalPagado >= c.total) {
            c.estado = "PAGADO";
        }
        return c;
    });

    localStorage.setItem("comprobantes", JSON.stringify(comprobantes));
}

// Saber si está vencido
function estaVencido(comprobante) {
    const hoy = new Date();
    const vencimiento = new Date(comprobante.fechaVencimiento);

    return comprobante.estado === "PENDIENTE" && vencimiento < hoy;
}


//Render tabla de comprobantes
function renderTablaComprobantes() {
    const tbody = document.querySelector("#tablaComprobantes tbody");
    tbody.innerHTML = "";

    const comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];
    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    comprobantes.forEach(c => {
        const totalPagado = pagos
            .filter(p => p.idComprobante === c.id)
            .reduce((s, p) => s + p.monto, 0);

        const saldo = c.total - totalPagado;

        let estadoClase = "pendiente";
        let estadoTexto = "PENDIENTE";

        if (c.estado === "PAGADO") {
            estadoClase = "pagado";
            estadoTexto = "PAGADO";
        } else if (estaVencido(c)) {
            estadoClase = "vencido";
            estadoTexto = "VENCIDO";
        }

        const cliente = clientes.find(cl => cl.dni === c.dniCliente);

        tbody.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${cliente?.nombres || ""}</td>
                <td>${c.tipo}</td>
                <td>S/ ${c.total}</td>
                <td>S/ ${totalPagado}</td>
                <td>S/ ${saldo}</td>
                <td><span class="estado ${estadoClase}">${estadoTexto}</span></td>
                <td>
                    <button onclick="verPagos('${c.id}')">🔍</button>
                </td>
            </tr>
        `;
    });
}


function verPagos(idComprobante) {
    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];
    const lista = document.getElementById("listaPagos");

    lista.innerHTML = "";

    pagos
        .filter(p => p.idComprobante === idComprobante)
        .forEach(p => {
            lista.innerHTML += `
                <li>
                    📅 ${p.fechaPago} — S/ ${p.monto}
                </li>
            `;
        });

    document.getElementById("modalPagos").style.display = "block";
}

function cerrarModal() {
    document.getElementById("modalPagos").style.display = "none";
}
/* =============================== */