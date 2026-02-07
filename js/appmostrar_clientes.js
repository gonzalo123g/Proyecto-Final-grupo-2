/*document.addEventListener("DOMContentLoaded", mostrarClientes)

    function mostrarClientes() {
        const tablaBody = document.querySelector("#tablaClientes tbody");
        tablaBody.innerHTML = "";

        lstClientes.forEach((c, index) => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${c.dni}</td>
                <td>${c.nombres}</td>
                <td>${c.apellidos}</td>
                <td>${c.correo}</td>
                <td>${c.telefono}</td>
                <td>
                    <button onclick="editarCliente(${index})">✏️</button>
                    <button onclick="eliminarCliente(${index})">🗑</button>
                </td>
            `;

            tablaBody.appendChild(fila);
        });
    };

*/

document.addEventListener("DOMContentLoaded", () => {
    mostrarClientes();

    const form = document.getElementById("frmClientes");
    if (form) form.addEventListener("submit", guardarCliente);

// Edit form setup
    const editForm = document.getElementById("frmEditar");
    const btnCancelar = document.getElementById("btnCancelar");
    if (editForm) {
        editForm.addEventListener("submit", actualizarCliente);
    }
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            document.getElementById("editSection").style.display = "none";
            if (editForm) editForm.reset();
            currentEditIndex = null;
        });
    }
});

function guardarCliente(e) {
    e.preventDefault();

    const cliente = {
        nombres: document.getElementById("nombres").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        dni: document.getElementById("dni").value.trim(),
        ruc: document.getElementById("ruc").value.trim(),
        direccion: document.getElementById("direccion").value.trim(),
        correo: document.getElementById("Correo").value.trim(),
        telefono: document.getElementById("num_cel").value.trim()
    };

    if (!cliente.nombres || !cliente.apellidos || !cliente.dni) {
        alert("⚠️ Complete los campos obligatorios");
        return;
    }

    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    // ❌ Evitar DNI duplicado
    if (clientes.some(c => c.dni === cliente.dni)) {
        alert("❌ Ya existe un cliente con ese DNI");
        return;
    }

    clientes.push(cliente);
    localStorage.setItem("clientes", JSON.stringify(clientes));

    document.getElementById("frmClientes").reset();
    mostrarClientes();
}

function mostrarClientes() {
    const tbody = document.querySelector("#tablaClientes tbody");
    tbody.innerHTML = "";

    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    clientes.forEach((cliente, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${cliente.nombres}</td>
            <td>${cliente.apellidos}</td>
            <td>${cliente.dni}</td>
            <td>${cliente.correo}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.direccion}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editarCliente(${index})">✏️</button>
                <button class="btn-action btn-delete" onclick="eliminarCliente(${index})">🗑</button>
            </td>
        `;

        tbody.appendChild(fila);
    });
}

function eliminarCliente(index) {
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    clientes.splice(index, 1);
    localStorage.setItem("clientes", JSON.stringify(clientes));

Swal.fire({
        icon: "question",
        title: "¿Estás seguro?",
        text: "El cliente será eliminado permanentemente.",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: "success",
                title: "✅ Cliente eliminado",
                text: "El cliente ha sido eliminado correctamente."
            });
            mostrarClientes();
}
    });
};

// La funcionalidad de edicion
let currentEditIndex = null;

function editarCliente(index) {
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const cliente = clientes[index];
    if (!cliente) return alert("Cliente no encontrado");

    document.getElementById("edit_nombres").value = cliente.nombres || "";
    document.getElementById("edit_apellidos").value = cliente.apellidos || "";
    document.getElementById("edit_dni").value = cliente.dni || "";
    document.getElementById("edit_Correo").value = cliente.correo || "";
    document.getElementById("edit_num_cel").value = cliente.telefono || "";
    document.getElementById("edit_direccion").value = cliente.direccion || "";

    currentEditIndex = index;
    document.getElementById("editSection").style.display = "block";
    document.getElementById("editSection").scrollIntoView({ behavior: "smooth" });
}

function actualizarCliente(e) {
    e.preventDefault();
    if (currentEditIndex === null) return;

    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const nombres = document.getElementById("edit_nombres").value.trim();
    const apellidos = document.getElementById("edit_apellidos").value.trim();
    const dni = document.getElementById("edit_dni").value.trim();
    const correo = document.getElementById("edit_Correo").value.trim();
    const telefono = document.getElementById("edit_num_cel").value.trim();
    const direccion = document.getElementById("edit_direccion").value.trim();

    if (!nombres || !apellidos || !dni) {
        alert("⚠️ Complete los campos obligatorios");
        return;
    }

    // Comprobar DNI duplicado excluyendo el actual
    const existe = clientes.some((c, i) => c.dni === dni && i !== currentEditIndex);
    if (existe) {
        alert("❌ Ya existe otro cliente con ese DNI");
        return;
    }

    clientes[currentEditIndex] = { nombres, apellidos, dni, correo, telefono, direccion };
    localStorage.setItem("clientes", JSON.stringify(clientes));

    document.getElementById("editSection").style.display = "none";
    const editForm = document.getElementById("frmEditar");
    if (editForm) editForm.reset();
    currentEditIndex = null;

    Swal.fire({
        icon: "success",
        title: "✅ Cliente actualizado",
        text: "Los datos del cliente han sido actualizados correctamente."
    });

    mostrarClientes();
}
