window.onload = () => {
  // agregarTarea();
  getTareas();

  document.forms.agregarTarea.addEventListener( 'submit', event => {
    event.preventDefault();
    agregarTarea()
  });
}

comprobarToken();
setInterval(() => {
  comprobarToken();
}, 100000)

function comprobarToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    location.href = './login.html'
  }
}

function crearTareas(tareas) {
  document.querySelector('ul.tareas-pendientes').innerHTML = '';
  document.querySelector('ul.tareas-terminadas').innerHTML = '';
  
  tareas.forEach(tarea => {
    renderizarTarea(tarea)
  })
}

function renderizarTarea(tarea) {
  const template = `
    <li class="tarea animar-entrada">
      <div class="not-done" onclick='completarTarea(${tarea.id}, ${tarea.completed})'></div>
      <div class="descripcion">
        <p class="nombre">${tarea.description}</p>
        <p class="timestamp">Creado el: ${tarea.createdAt}</p>
        <button class="eliminar"  onclick='eliminarTarea(${tarea.id})'>Eliminar</button>
      </div>
    </li>
  `;

  const contenedorTareas = document.querySelector('ul.tareas-pendientes');
  const contenedorTareasCompletas = document.querySelector('ul.tareas-terminadas');
  if (!tarea.completed) {
    contenedorTareas.innerHTML += template;
  } else {
    contenedorTareasCompletas.innerHTML += template;
  }
}

function agregarTarea() {
  const descripcion = document.forms.agregarTarea.descripcionNuevaTarea.value;
  const body = {
    description: descripcion,
    completed: false
  }
  RequestManager.post('/tasks',body).then( tarea => {
    renderizarTarea(tarea);
  }).catch( err => {
    console.log(err);
  })
/* 
  const token = localStorage.getItem('token');
  const url = 'https://ctd-todo-api.herokuapp.com/v1'

  fetch(`${url}/tasks`, {
    method: 'POST', 
    headers: {
      authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then( data => {
    return data.json();
  }).then( tarea => {
    renderizarTarea(tarea);
  }).catch( err => {
    console.log(err);
  }) */
}

function getTareas() {
  RequestManager.get('/tasks').then(tareas => {
    crearTareas(tareas);
  })
}

function completarTarea(id, completed) {

  const body = {
    completed: !completed
  }

  RequestManager.put(`/tasks/${id}`,body).then(tarea => {
    getTareas();
  }).catch(err => {
    console.log(err)
  })
/* 
  const url = 'https://ctd-todo-api.herokuapp.com/v1';
  const token = localStorage.getItem('token');

  fetch(`${url}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      completed: !completed
    })
  }).then(datos => {
    return datos.json();
  }).then(tarea => {
    getTareas();
  }).catch(err => {
    console.log(err)
  }) */
}

function eliminarTarea(id) {


/*   const url = 'https://ctd-todo-api.herokuapp.com/v1';
  const token = localStorage.getItem('token'); */

  if (!confirm('Esta seguro que desea eliminar la tarea?')) {
    return;
  } 

  RequestManager.delete(`/tasks/${id}`).then(tarea => {
    getTareas();
  }).catch(err => {
    console.log(err)
  })

/*   fetch(`${url}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      authorization: token
    }
  }).then(tarea => {
    document.querySelector('ul.tareas-pendientes').innerHTML = '';
    document.querySelector('ul.tareas-terminadas').innerHTML = '';
    getTareas();
  }).catch(err => {
    console.log(err)
  }) */
}

