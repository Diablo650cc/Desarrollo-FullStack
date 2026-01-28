console.log("JavaScript conectado correctamente");

const input = document.getElementById("tareaInput");
const boton = document.getElementById("btnAgregar");
const lista = document.getElementById("listaTareas");
const mensaje = document.getElementById("mensaje");


class Tarea {
    constructor(nombre, completa = false) {
        this.id = Date.now();
        this.nombre = nombre;
        this.completa = completa;
    }

    toggleEstado() {
        this.completa = !this.completa;
    }

    editar(nuevoNombre) {
        this.nombre = nuevoNombre;
    }
}


class GestorDeTareas {
    constructor() {
        this.tareas = [];
    }

    agregar(nombre) {
        const nueva = new Tarea(nombre);
        this.tareas.push(nueva);
        this.guardar();
    }

    eliminar(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardar();
    }

    editar(id, nuevoNombre) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) tarea.editar(nuevoNombre);
        this.guardar();
    }

    toggleEstado(id) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) tarea.toggleEstado();
        this.guardar();
    }

    guardar() {
        localStorage.setItem("tareas", JSON.stringify(this.tareas));
    }

    cargar() {
        const datos = JSON.parse(localStorage.getItem("tareas"));
        if (datos) this.tareas = datos;
    }
}

const gestor = new GestorDeTareas();
gestor.cargar();
renderLista();


function renderLista() {
    lista.innerHTML = "";

    gestor.tareas.forEach(tarea => {
        const li = document.createElement("li");
        li.textContent = tarea.nombre;

        if (tarea.completa) {
            li.classList.add("completa");
        }


        li.addEventListener("click", () => {
            gestor.toggleEstado(tarea.id);
            renderLista();
        });


        li.addEventListener("dblclick", () => {
            gestor.eliminar(tarea.id);
            renderLista();
        });


        li.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const nuevo = prompt("Editar tarea:", tarea.nombre);
            if (nuevo) {
                gestor.editar(tarea.id, nuevo);
                renderLista();
            }
        });

        lista.appendChild(li);
    });
}


boton.addEventListener("click", () => {
    const texto = input.value.trim();

    if (texto === "") {
        mensaje.textContent = "No puedes agregar tareas vacías.";
        mensaje.classList.add("mensaje-error");
        return;
    }

    mensaje.textContent = "";
    mensaje.classList.remove("mensaje-error");

    gestor.agregar(texto);
    input.value = "";
    renderLista();
});
