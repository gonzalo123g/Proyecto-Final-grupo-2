
/* Ejemplo de como guardar datos sin que se sobreescriban
document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("frmClientes");
    const nombres = document.getElementById("nombres");
    const apellidos = document.getElementById("apellidos");
    const dni = document.getElementById("dni");
    const ruc = document.getElementById("ruc");
    const direccion = document.getElementById("direccion");
    const Correo = document.getElementById("Correo");
    const num_cel = document.getElementById("num_cel");

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        // 1️⃣ Obtener clientes existentes o crear array vacío
        let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

        // 2️⃣ Capturar datos del formulario
        const cliente = {
            nombres: document.getElementById("nombres").value.trim(),
            apellidos: document.getElementById("apellidos").value.trim(),
            dni: document.getElementById("dni").value.trim(),
            ruc: document.getElementById("ruc").value.trim(),
            direccion: document.getElementById("direccion").value.trim(),
            correo: document.getElementById("Correo").value.trim(),
            telefono: document.getElementById("num_cel").value.trim(),
            fechaRegistro: new Date().toLocaleString()
        };

        // 3️⃣ Validar campos obligatorios
        if (!cliente.nombres || !cliente.apellidos || !cliente.dni) {
            alert("⚠️ Complete los campos obligatorios");
            return;
        }

        // 4️⃣ Evitar DNI duplicado
        const existe = clientes.some(c => c.dni === cliente.dni);

        if (existe) {
            alert("❌ El DNI ya está registrado");
            return;
        }

        // 5️⃣ Guardar cliente
        clientes.push(cliente);
        localStorage.setItem("clientes", JSON.stringify(clientes));

        alert("✅ Cliente registrado correctamente");

        formulario.reset();
    });
});
*/

document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("frmClientes");
    //const tablaBody = document.querySelector("#tablaClientes tbody");

    const nombres = document.getElementById("nombres");
    const apellidos = document.getElementById("apellidos");
    const dni = document.getElementById("dni");
    const ruc = document.getElementById("ruc");
    const direccion = document.getElementById("direccion");
    const Correo = document.getElementById("Correo");
    const num_cel = document.getElementById("num_cel");

    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

   // mostrarClientes();

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const cliente = {
            nombres: nombres.value.trim(),
            apellidos: apellidos.value.trim(),
            dni: dni.value.trim(),
            ruc: ruc.value.trim(),
            direccion: direccion.value.trim(),
            correo: Correo.value.trim(),
            telefono: num_cel.value.trim()
        };

        if (!cliente.nombres || !cliente.apellidos || !cliente.dni) {
            alert("⚠️ Complete los campos obligatorios");
            return;
        }

        if (cliente.dni.length !== 8) {
            alert("⚠️ El DNI debe tener exactamente 8 dígitos");
            return;
        }

        const existe = clientes.some(c => c.dni === cliente.dni);
        if (existe) {
            alert("❌ El DNI ya existe");
            return;
        }

        clientes.push(cliente);
        guardar();
        formulario.reset();
        //mostrarClientes();
});

    function guardar() {
        localStorage.setItem("clientes", JSON.stringify(clientes));
            Swal.fire({
                icon: 'success',
                title: '✅ Cliente registrado',
                text: `Cliente registrado correctamente.`
            });
        }
    });
