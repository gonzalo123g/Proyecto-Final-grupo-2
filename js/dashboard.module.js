// js/dashboard.module.js

export function totalClientes() {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    return clientes.length;
}

export function dineroPorCobrar() {
    const comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];
    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];

    let totalPendiente = 0;

    comprobantes.forEach(c => {
        const pagado = pagos
            .filter(p => p.idComprobante === c.id)
            .reduce((s, p) => s + p.monto, 0);

        const saldo = c.total - pagado;

        if (saldo > 0) {
            totalPendiente += saldo;
        }
    });

    return totalPendiente;
}
