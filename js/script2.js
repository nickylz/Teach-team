document.addEventListener('DOMContentLoaded', () => {
  const userArea = document.getElementById('userArea');

  // Modales
  const modal = document.getElementById('modalLogin');
  const cerrar = document.getElementById('cerrarModal');
  const formLogin = document.getElementById('formLogin');

  const modalRegistro = document.getElementById('modalRegistro');
  const cerrarRegistro = document.getElementById('cerrarRegistro');
  const linkRegistro = document.querySelector('.registro-texto a');
  const linkVolverLogin = document.getElementById('linkVolverLogin');
  const formRegistro = document.getElementById('formRegistro');

  // Botones comprar (para abrir modal si no hay sesión)
  const botonesComprar = document.querySelectorAll('.comp-boton');

  // Función que pinta el header según sesión
  function renderUserArea() {
   const user = localStorage.getItem('usuario');
if (user) {
  // Si tiene un @, corta y muestra solo lo de antes
  const mostrarNombre = user.includes('@') ? user.split('@')[0] : user;

  userArea.innerHTML = `
    <span class="user-info">${mostrarNombre}</span>
    <button id="btnCerrarSesion" class="btn-logout">Cerrar sesión</button>
  `;

      document.getElementById('btnCerrarSesion').addEventListener('click', () => {
        localStorage.removeItem('usuario');
        renderUserArea();
      });
    } else {
      userArea.innerHTML = `<button id="btnAbrirLogin" class="btn-login-nav">Iniciar sesión</button>`;
      document.getElementById('btnAbrirLogin').addEventListener('click', () => {
        modal.style.display = 'flex';
        document.getElementById('usuario').focus();
      });
    }
  }

  // Mostrar header según sesión al cargar
  renderUserArea();

  // === Eventos modales ===

  // Cerrar modal login
  cerrar.addEventListener('click', () => modal.style.display = 'none');

  // Cerrar modal registro
  cerrarRegistro.addEventListener('click', () => modalRegistro.style.display = 'none');

  // Cerrar al hacer clic fuera
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
    if (e.target === modalRegistro) modalRegistro.style.display = 'none';
  });

  // Ir de login → registro
  linkRegistro.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'none';
    modalRegistro.style.display = 'flex';
  });

  // Volver de registro → login
  linkVolverLogin.addEventListener('click', (e) => {
    e.preventDefault();
    modalRegistro.style.display = 'none';
    modal.style.display = 'flex';
  });

  // Manejar login simulado
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('usuario').value.trim();
    if (nombre) {
      localStorage.setItem('usuario', nombre);
      modal.style.display = 'none';
      renderUserArea();
      alert(`Bienvenido, ${nombre}`);
    }
  });

  // Manejar registro simulado
  formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nuevoUsuario').value.trim();
    if (nombre) {
      localStorage.setItem('usuario', nombre);
      modalRegistro.style.display = 'none';
      renderUserArea();
      alert(`Cuenta creada para ${nombre}. Sesión iniciada.`);
    }
  });
});

document.getElementById('navToggle').addEventListener('click', function () {
  const nav = document.getElementById('mainNav');
  nav.classList.toggle('mostrar');
});
