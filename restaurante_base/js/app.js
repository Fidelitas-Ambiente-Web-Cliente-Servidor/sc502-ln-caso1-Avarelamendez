const menu = [
  { nombre: 'Bruschetta Clásica', descripcion: 'Pan tostado con tomate y albahaca fresca', precio: 4500, categoria: 'Entrada' },
  { nombre: 'Tabla de Quesos', descripcion: 'Selección de quesos importados con mermelada', precio: 7800, categoria: 'Entrada' },
  { nombre: 'Lomo al Vino Tinto', descripcion: 'Lomo de res en reducción de vino tinto', precio: 15500, categoria: 'Plato Fuerte' },
  { nombre: 'Pasta Carbonara', descripcion: 'Pasta con tocino, huevo y queso parmesano', precio: 10200, categoria: 'Plato Fuerte' },
  { nombre: 'Salmón a la Plancha', descripcion: 'Filete de salmón con vegetales al vapor', precio: 13800, categoria: 'Plato Fuerte' },
  { nombre: 'Tiramisú', descripcion: 'Postre italiano con café y mascarpone', precio: 5200, categoria: 'Postre' },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá', precio: 4800, categoria: 'Postre' },
];

const reservas = [];

// Esta funcion llama a las tarjetas del menu
function renderMenu() {
  const contenedor = document.querySelector('.cards-wrapper');
  contenedor.innerHTML = '';

  menu.forEach(plato => {
    const card = document.createElement('div');
    card.className = 'card-plato';
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-plato__nombre">${plato.nombre}</h5>
        <p class="card-plato__descripcion">${plato.descripcion}</p>
        <span class="card-plato__categoria">${plato.categoria}</span>
        <p class="card-plato__precio">₡${plato.precio.toLocaleString('es-CR')}</p>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

//esta funcion filtra el menu según la categoría que elija el usuario desde los botones de la pagina
function filtrarCategoria(categoria) {
  const contenedor = document.querySelector('.cards-wrapper');
  contenedor.innerHTML = '';

  const platosFiltrados = !['Entrada', 'Plato Fuerte', 'Postre'].includes(categoria)
    ? menu
    : menu.filter(plato => plato.categoria === categoria);

  platosFiltrados.forEach(plato => {
    const card = document.createElement('div');
    card.className = 'card-plato';
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-plato__nombre">${plato.nombre}</h5>
        <p class="card-plato__descripcion">${plato.descripcion}</p>
        <span class="card-plato__categoria">${plato.categoria}</span>
        <p class="card-plato__precio">₡${plato.precio.toLocaleString('es-CR')}</p>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

//Esta función muestra un error en el formulario si el usuario digita un campo de forma erronea
function mostrarError(idCampo, mensaje) {
  const campo = document.getElementById(idCampo);
  let error = campo.nextElementSibling;
  if (!error || !error.classList.contains('error-campo')) {
    error = document.createElement('span');
    error.className = 'error-campo';
    campo.insertAdjacentElement('afterend', error);
  }
  error.textContent = mensaje;
}

// esta función valida los elementos del input del usuario para corroborar que la información sea correcta
function validarFormulario() {
  let valido = true;

  document.querySelectorAll('.error-campo').forEach(e => e.textContent = '');

  const nombre = document.getElementById('inputNombre').value.trim();
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{5,}$/.test(nombre)) {
    mostrarError('inputNombre', 'El nombre debe tener mínimo 5 caracteres y solo letras.');
    valido = false;
  }

  const correo = document.getElementById('inputCorreo').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    mostrarError('inputCorreo', 'Ingresá un correo electrónico válido.');
    valido = false;
  }

  const fecha = document.getElementById('inputFecha').value;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (!fecha || new Date(fecha) < hoy) {
    mostrarError('inputFecha', 'La fecha debe ser hoy o una fecha futura.');
    valido = false;
  }

  const cantidad = parseInt(document.getElementById('inputCantidad').value);
  if (isNaN(cantidad) || cantidad < 1 || cantidad > 20) {
    mostrarError('inputCantidad', 'La cantidad debe ser entre 1 y 20 personas.');
    valido = false;
  }

  return valido;
}

//Esta función valida que la información ingresada en el form sea correcta para poder habilitar el boton de reserva
function verificarBoton() {
  const nombre = document.getElementById('inputNombre').value.trim();
  const correo = document.getElementById('inputCorreo').value.trim();
  const fecha = document.getElementById('inputFecha').value;
  const cantidad = parseInt(document.getElementById('inputCantidad').value);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const valido =
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{5,}$/.test(nombre) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) &&
    fecha && new Date(fecha) >= hoy &&
    !isNaN(cantidad) && cantidad >= 1 && cantidad <= 20;

  document.querySelector('.btn.btn-primary').disabled = !valido;
}

//esta función guarda la información de las reservas
function agregarReserva() {
  const nombre   = document.getElementById('inputNombre').value.trim();
  const correo   = document.getElementById('inputCorreo').value.trim();
  const fecha    = document.getElementById('inputFecha').value;
  const cantidad = parseInt(document.getElementById('inputCantidad').value);
  const hora     = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });

  reservas.push({ nombre, correo, fecha, hora, cantidad });

  const tbody = document.querySelector('.tabla-reservas tbody');
  const fila  = document.createElement('tr');
  fila.className = cantidad >= 6 ? 'fila-reserva fila-vip' : 'fila-reserva';
  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${correo}</td>
    <td>${fecha}</td>
    <td>${hora}</td>
    <td>${cantidad}</td>
  `;
  tbody.appendChild(fila);

  document.getElementById('form-reserva').reset();
  document.querySelector('.btn.btn-primary').disabled = true;
  actualizarResumen();
}

//Esta función actualiza las tarjetas que indican el total de las reservas
function actualizarResumen() {
  const total         = reservas.length;
  const totalPersonas = reservas.reduce((sum, r) => sum + r.cantidad, 0);
  const mayorReserva  = reservas.reduce((max, r) => r.cantidad > max.cantidad ? r : max, reservas[0]);

  document.querySelector('.resumen-total').textContent          = total;
  document.querySelector('.resumen-personas').textContent       = totalPersonas;
  document.querySelector('.resumen-mayor-nombre').textContent   = mayorReserva.nombre;
  document.querySelector('.resumen-mayor-cantidad').textContent = `(${mayorReserva.cantidad} personas)`;
}

document.addEventListener('DOMContentLoaded', function () {
  renderMenu();

  ['inputNombre', 'inputCorreo', 'inputFecha', 'inputCantidad'].forEach(id => {
    document.getElementById(id).addEventListener('input', verificarBoton);
  });

  document.getElementById('form-reserva').addEventListener('submit', function (e) {
    e.preventDefault();
    if (validarFormulario()) {
      agregarReserva();
    }
  });
});