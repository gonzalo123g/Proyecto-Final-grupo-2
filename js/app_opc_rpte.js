// Control de los eventos de cada botón de la ventana principal
function activacion(type) {
  switch (type) {
    case 'rpt_clientes':
      window.location.href = "../paginas/mostrar_clientes.html";
      //alert('Ir a Registro de Clientes');
      break;
    case 'rpt_factura':
      window.location.href = "../paginas/rpte_comprobante.html";
      break;
    case 'rpt_fac_vencidas':
      window.location.href = "../paginas/reporte_vencidos.html";
      break;
  }
}

function exportarReporteComprobantes() {
    const comprobantes = JSON.parse(localStorage.getItem("comprobantes")) || [];
    const pagos = JSON.parse(localStorage.getItem("pagos")) || [];
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    if (comprobantes.length === 0) {
        alert("No hay comprobantes para exportar");
        return;
    }

    let csv = "ID,Cliente,Tipo,Total,Pagado,Saldo,Estado\n";

    comprobantes.forEach(c => {
        const cliente = clientes.find(cl => cl.dni === c.dniCliente);
        const nombreCliente = cliente
            ? `${cliente.nombres} ${cliente.apellidos}`
            : "No definido";

        const totalPagado = pagos
            .filter(p => p.idComprobante === c.id)
            .reduce((s, p) => s + p.monto, 0);

        const saldo = c.total - totalPagado;

        let estado = "PENDIENTE";
        if (c.estado === "PAGADO") estado = "PAGADO";
        else if (estaVencido(c)) estado = "VENCIDO";

        csv += `${c.id},"${nombreCliente}",${c.tipo},${c.total},${totalPagado},${saldo},${estado}\n`;
    });

    descargarArchivo(csv, "reporte_comprobantes.csv");
}


function descargarArchivo(contenido, nombreArchivo) {
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    link.click();

    URL.revokeObjectURL(url);
}

