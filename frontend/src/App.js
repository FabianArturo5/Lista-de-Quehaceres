import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";
import 'C:/Users/Desarrollo/Desktop/todo/Lista-de-Quehaceres/frontend/src/App.css'; // Asegúrate de que la ruta sea correcta


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false, // Estado para alternar entre tareas completadas e incompletas.
      todoList: [], // Lista de tareas obtenidas del servidor.
      modal: false, // Controla la visibilidad del modal.
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
    };
  }

  // Llama a la API para obtener las tareas al cargar el componente.
  componentDidMount() {
    this.refreshList();
  }

  // Obtiene la lista de tareas desde el backend.
  refreshList = () => {
    axios
      .get("/api/todos/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
  };

  // Alterna el estado del modal.
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  // Envía los datos del formulario al backend (para crear o actualizar tareas).
  handleSubmit = (item) => {
    this.toggle();
    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios.post("/api/todos/", item).then((res) => this.refreshList());
  };

  // Elimina una tarea del backend.
  handleDelete = (item) => {
    axios
      .delete(`/api/todos/${item.id}/`)
      .then((res) => this.refreshList());
  };

  // Crea una nueva tarea.
  createItem = () => {
    const item = { Titulo: "", Descripcion: "" };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  // Edita una tarea existente.
  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  // Filtra las tareas según si están completadas o no.
  displayCompleted = (status) => {
    this.setState({ viewCompleted: status });
  };

  // NUEVA FUNCIÓN: Cambia el estado "completado" de una tarea.
  handleToggleComplete = (item) => {
    const updatedItem = { ...item, completed: !item.completed }; // Invierte el estado.
    axios
      .put(`/api/todos/${item.id}/`, updatedItem) // Actualiza en el backend.
      .then((res) => this.refreshList()) // Refresca la lista.
      .catch((err) => console.log(err)); // Maneja errores.
  };

  // Renderiza las pestañas (Completadas e Incompletas).
  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
        >
          Completado
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
        >
          Pendiente
        </span>
      </div>
    );
  };

  // Renderiza la lista de tareas con el toggle switch.
  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span className="d-flex align-items-center">
          {/* NUEVO: Toggle switch para marcar como completada */}
          <label className="switch">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => this.handleToggleComplete(item)}
            />
            <span className="slider round"></span>
          </label>

          {/* Botón para editar */}
          <button
            className="btn btn-warning ml-3"
            onClick={() => this.editItem(item)}
          >
            Editar
          </button>

          {/* Botón para eliminar */}
          <button
            className="btn btn-danger ml-2"
            onClick={() => this.handleDelete(item)}
          >
            Eliminar
          </button>
        </span>
      </li>
    ));
  };

  // Renderiza el componente principal.
  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Lista de quehaceres</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <center>
                  <button className="btn btn-primary" onClick={this.createItem} >
                    Añadir Tarea
                  </button>
                </center>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default App;
