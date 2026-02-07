// Control de los eventos de cada botón de la ventana principal
function action(type) {
  switch (type) {
    case 'clientes':
      window.location.href = "../paginas/reg_cliente.html";
      //alert('Ir a Registro de Clientes');
      break;
    case 'factura':
      window.location.href = "../paginas/reg_comprobante.html";
      //alert('Emitir nueva factura');
      break;
    case 'vencidas':

      window.location.href = "../paginas/reg_pagos.html";
      //alert('Ver facturas vencidas');
      break;
  }
}

