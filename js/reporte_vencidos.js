document.addEventListener("DOMContentLoaded", cargarComprobantesVencidos);

function cargarComprobantesVencidos() {

    const comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];

    const tbody = document.querySelector("#tablaVencidos tbody");
    tbody.innerHTML = "";

    const hoy = new Date();

    const vencidos = comprobantes.filter(c => {
        if (c.estado === "PAGADO") return false;

        const vencimiento = new Date(c.fechaVencimiento);
        return vencimiento < hoy;
    });

    if (vencidos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">✅ No existen comprobantes vencidos</td>
            </tr>
        `;
        return;
    }

    vencidos.forEach(c => {

        const cliente = clientes.find(cl => cl.dni === c.dniCliente);

        const totalPagado = pagos
            .filter(p => p.idComprobante === c.id)
            .reduce((s, p) => s + p.monto, 0);

        const saldo = c.total - totalPagado;

        tbody.innerHTML += `
            <tr>
                <td>${cliente?.nombres || "—"}</td>
                <td>${cliente?.dni || cliente?.ruc || "—"}</td>
                <td>${c.tipo}</td>
                <td>S/ ${saldo.toFixed(2)}</td>
                <td>${c.fechaVencimiento}</td>
                <td class="vencido">VENCIDO</td>
            </tr>
        `;
    });
}
