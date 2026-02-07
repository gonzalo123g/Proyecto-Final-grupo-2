
document.addEventListener("DOMContentLoaded", () => {
    cargarComprobantes();
    renderTablaComprobantes();
    actualizarDashboard();

    document.getElementById("comprobanteSelect")
        .addEventListener("change", e => {
            const id = e.target.value;
            if (!id) {
                limpiarDetallePagos();
                return;
            }
            renderDetalleComprobante(id);
        });
});

/* ===============================
   CARGAR COMPROBANTES
================================ */

function cargarComprobantes() {
    const select = document.getElementById("comprobanteSelect");
    select.innerHTML = `<option value="">-- Seleccione comprobante --</option>`;

    const comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];

    comprobantes.forEach(c => {
        select.innerHTML += `
            <option value="${c.id}">
                ${c.id} | ${c.tipo} | S/ ${c.total}
            </option>
        `;
    });
}

/* ===============================
   REGISTRAR PAGO (VALIDADO)
================================ */

function registrarPago() {
    const select = document.getElementById("comprobanteSelect");
    const inputMonto = document.getElementById("montoPago");

    const id = select.value;
    const monto = Number(inputMonto.value);

    if (!id || monto <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Monto o comprobante inválido',
            text: 'Seleccione un comprobante y un monto válido'
        });
        return;
    }

    const comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];
    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];

    const comprobante = comprobantes.find(c => c.id === id);
    if (!comprobante) return;

    const totalPagado = pagos
        .filter(p => p.idComprobante === id)
        .reduce((s, p) => s + p.monto, 0);

    const saldo = comprobante.total - totalPagado;
    const esPagoTotal = monto === saldo;

    // 🚫 bloqueo pago excedente
    if (monto > saldo) {
        Swal.fire({
            icon: 'error',
            title: 'Pago mayor al saldo',
            text: `El pago excede el saldo pendiente`
        });
        return;
    }
    
    

    pagos.push({
        idComprobante: id,
        monto: monto,
        fechaPago: new Date().toISOString().split("T")[0]
    });

    localStorage.setItem("pagos", JSON.stringify(pagos));

    actualizarEstadoComprobante(id);
    renderDetalleComprobante(id);
    renderTablaComprobantes();
    actualizarDashboard();

    inputMonto.value = "";

    if (esPagoTotal) {
    Swal.fire({
        icon: 'success',
        title: '¡Comprobante pagado!',
        text: 'El comprobante ha sido cancelado en su totalidad.',
        timer: 2200,
        showConfirmButton: false
    });
} else {
    Swal.fire({
        icon: 'success',
        title: 'Pago registrado',
        text: 'Pago registrado correctamente.',
        timer: 1800,
        showConfirmButton: false
    });
}

}


/*
function registrarPago() {
    const id = comprobanteSelect.value;
    const monto = Number(montoPago.value);

    if (!id || monto <= 0) {
        alert("⚠️ Seleccione un comprobante y un monto válido");
        return;
    }

    const comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];
    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];

    const comprobante = comprobantes.find(c => c.id === id);

    const totalPagado = pagos
        .filter(p => p.idComprobante === id)
        .reduce((s, p) => s + p.monto, 0);

    const saldo = comprobante.total - totalPagado;

    if (monto > saldo) {
        alert(`❌ El pago excede el saldo pendiente (S/ ${saldo})`);
        return;
    }

    pagos.push({
        idComprobante: id,
        monto,
        fechaPago: new Date().toISOString().split("T")[0]
    });

    localStorage.setItem("pagos", JSON.stringify(pagos));

    actualizarEstadoComprobante(id);
    renderDetalleComprobante(id);
    renderTablaComprobantes();
    actualizarDashboard();

    montoPago.value = "";
}*/

/* ===============================
   ESTADO DEL COMPROBANTE
================================ */

function actualizarEstadoComprobante(id) {
    let comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];
    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];

    const totalPagado = pagos
        .filter(p => p.idComprobante === id)
        .reduce((s, p) => s + p.monto, 0);

    comprobantes = comprobantes.map(c => {
        if (c.id === id) {
            c.estado = totalPagado >= c.total ? "PAGADO" : "PENDIENTE";
        }
        return c;
    });

    localStorage.setItem("comprobantes", JSON.stringify(comprobantes));
}

/* ===============================
   DETALLE DEL COMPROBANTE
================================ */

function renderDetalleComprobante(id) {
    const comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];
    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];

    const comprobante = comprobantes.find(c => c.id === id);
    if (!comprobante) return;

    const pagosFiltrados = pagos.filter(p => p.idComprobante === id);

    let totalPagado = 0;
    const tbody = document.querySelector("#tablaPagos tbody");
    tbody.innerHTML = "";

    pagosFiltrados.forEach(p => {
        totalPagado += p.monto;
        tbody.innerHTML += `
            <tr>
                <td>${p.fechaPago}</td>
                <td>S/ ${p.monto.toFixed(2)}</td>
            </tr>
        `;
    });

    const saldo = comprobante.total - totalPagado;

    document.getElementById("resumenPago").innerHTML = `
        Total: S/ ${comprobante.total.toFixed(2)} |
        Pagado: S/ ${totalPagado.toFixed(2)} |
        <span style="color:${saldo === 0 ? 'green' : 'red'}">
            Pendiente: S/ ${saldo.toFixed(2)}
        </span>
    `;
}

/* ===============================
   LIMPIEZA
================================ */

function limpiarDetallePagos() {
    document.querySelector("#tablaPagos tbody").innerHTML = "";
    document.getElementById("resumenPago").innerHTML =
        "Total: S/ 0 | Pagado: S/ 0 | Pendiente: S/ 0";
}

/* ===============================
   TABLA COMPROBANTES
================================ */

function renderTablaComprobantes() {
    const tbody = document.querySelector("#tablaComprobantes tbody");
    if (!tbody) return; // 🔐 evita que se rompa
    
    tbody.innerHTML = "";

    const comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];
    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    comprobantes.forEach(c => {
        const totalPagado = pagos
            .filter(p => p.idComprobante === c.id)
            .reduce((s, p) => s + p.monto, 0);

        const saldo = c.total - totalPagado;

        let estado = "pendiente";
        let texto = "PENDIENTE";

        if (c.estado === "PAGADO") {
            estado = "pagado";
            texto = "PAGADO";
        } else if (estaVencido(c)) {
            estado = "vencido";
            texto = "VENCIDO";
        }

        const cliente = clientes.find(cl => cl.dni === c.dniCliente);

        tbody.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${cliente?.nombres || ""}</td>
                <td>S/ ${c.total}</td>
                <td>S/ ${totalPagado}</td>
                <td>S/ ${saldo}</td>
                <td><span class="estado ${estado}">${texto}</span></td>
            </tr>
        `;
    });
}

/* ===============================
   DASHBOARD
================================ */

function actualizarDashboard() {
    const comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];

    let pendientes = 0, pagados = 0, vencidos = 0;

    comprobantes.forEach(c => {
        if (c.estado === "PAGADO") pagados++;
        else if (estaVencido(c)) vencidos++;
        else pendientes++;
    });

   if (typeof countPendientes !== "undefined" && countPendientes)
           countPendientes.textContent = pendientes;
   
       if (typeof countPagados !== "undefined" && countPagados)
           countPagados.textContent = pagados;
   
       if (typeof countVencidos !== "undefined" && countVencidos)
           countVencidos.textContent = vencidos;
}

/* ===============================
   VENCIMIENTO
================================ */

function estaVencido(c) {
    return c.estado !== "PAGADO" && new Date(c.fechaVencimiento) < new Date();
}

/* ===============================
   EVENTO SELECT COMPROBANTE
================================ */
document.getElementById("comprobanteSelect")
    .addEventListener("change", function () {
        const id = this.value;

        if (!id) {
            limpiarDetallePagos();
            return;
        }

        renderDetalleComprobante(id);
    });