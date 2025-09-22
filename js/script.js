// 1. Inicialización del carrito
let carrito = [];


// 2. Configuración de productos y botones de cantidad

document.querySelectorAll('.coleccion-item').forEach((item) => {
  let btn = item.querySelector('.comp-boton'); // Botón de agregar al carrito
  let nombre = item.querySelector('h3').textContent; // Nombre del producto
  let precio = parseFloat(item.querySelector('.price').textContent.replace(/[^\d.]/g, '')); // Precio
  let imagen = item.querySelector('img').src; // Imagen del producto

  // Crear controles de cantidad (+ / -)
  let cantidadDiv = document.createElement('div');
  cantidadDiv.classList.add('cantidad-controles');
  cantidadDiv.innerHTML = `
    <button class="menos">-</button>
    <span class="cantidad">1</span>
    <button class="mas">+</button>
  `;
  item.querySelector('.price').after(cantidadDiv);

  let cantidadSpan = cantidadDiv.querySelector('.cantidad');
  let cantidad = 1;

  // Disminuir cantidad
  cantidadDiv.querySelector('.menos').addEventListener('click', () => {
    if (cantidad > 1) {
      cantidad--;
      cantidadSpan.textContent = cantidad;

      let existente = carrito.find(p => p.nombre === nombre);
      if (existente) {
        existente.cantidad = cantidad;
        actualizarCarrito();
      }
    }
  });

  // Aumentar cantidad
  cantidadDiv.querySelector('.mas').addEventListener('click', () => {
    cantidad++;
    cantidadSpan.textContent = cantidad;

    let existente = carrito.find(p => p.nombre === nombre);
    if (existente) {
      existente.cantidad = cantidad;
      actualizarCarrito();
    }
  });

  // Agregar producto al carrito
btn.addEventListener('click', (e) => {
  e.preventDefault();

  // Validar sesión
  if (!localStorage.getItem('usuario')) {
    // Abrir modal de login si no hay sesión
    const modal = document.getElementById('modalLogin');
    modal.style.display = 'flex';
    document.getElementById('usuario').focus();
    return; // no mete al carrito hasta que inicie sesión
  }

  // Si hay sesión → mete producto al carrito
  let existente = carrito.find(p => p.nombre === nombre);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ nombre, precio, imagen, cantidad: cantidad });
  }
  cantidad = 1;
  cantidadSpan.textContent = 1;
  actualizarCarrito();
});


});


// 3. Actualizar carrito visualmente

function actualizarCarrito() {
  let carritoDiv = document.getElementById('carrito-items');
  carritoDiv.innerHTML = "";
  let total = 0;

  carrito.forEach((prod, index) => {
    let itemHTML = document.createElement("div");
    itemHTML.classList.add("carrito-item");
    itemHTML.innerHTML = `
      <img src="${prod.imagen}">
      <div class="info">
        <strong>${prod.nombre}</strong><br>
        S/${prod.precio.toFixed(2)} x ${prod.cantidad}
      </div>
      <div class="acciones">
        <button class="menosCarrito">-</button>
        <button class="masCarrito">+</button>
        <button class="eliminar">🗑️</button>
      </div>
    `;

    // Eventos para cambiar cantidad y eliminar producto desde el carrito
    itemHTML.querySelector(".menosCarrito").addEventListener("click", () => cambiarCantidad(index, -1));
    itemHTML.querySelector(".masCarrito").addEventListener("click", () => cambiarCantidad(index, 1));
    itemHTML.querySelector(".eliminar").addEventListener("click", () => eliminarProducto(index));

    carritoDiv.appendChild(itemHTML);

    total += prod.precio * prod.cantidad;
  });

  // Mostrar total y mostrar/ocultar carrito
  document.getElementById('total').textContent = "Total: S/" + total.toFixed(2);
  document.getElementById('carrito').style.display = carrito.length ? "block" : "none";
}

// 4. Cambiar cantidad de un producto en el carrito

function cambiarCantidad(i, delta) {
  carrito[i].cantidad += delta;
  if (carrito[i].cantidad <= 0) carrito.splice(i, 1);
  actualizarCarrito();
}


// 5. Eliminar producto del carrito

function eliminarProducto(i) {
  carrito.splice(i, 1);
  actualizarCarrito();
}

// 6. Funciones de modal de pago

function abrirModal() {
  document.getElementById('modalPago').style.display = "flex";
  actualizarResumenPago();
}

function cerrarModal() {
  document.getElementById('modalPago').style.display = "none";
}


// 7. Actualizar resumen del pago
function actualizarResumenPago() {
  let subtotal = carrito.reduce((sum, prod) => sum + prod.precio * prod.cantidad, 0);
  let envio = 5; // costo fijo de envío
  document.getElementById('subtotal').textContent = "S/" + subtotal.toFixed(2);
  document.getElementById('totalFinal').textContent = "S/" + (subtotal + envio).toFixed(2);
}

// 8. Finalizar compra

// Lista de imágenes para mostrar en el modal de gracias
const imagenes = [
  "https://i.postimg.cc/SsLjzJ0b/1.png",
  "https://i.postimg.cc/50zK5WpV/2.png",
  "https://i.postimg.cc/nrtR0Sw-Q/3.png",
  "https://i.postimg.cc/R0HLyQt1/4.png",
  "https://i.postimg.cc/Jz9bNDFs/5.png",
  "https://i.postimg.cc/6p7r4LMs/6.png",
  "https://i.postimg.cc/65hWVD1n/7.png",
  "https://i.postimg.cc/tT0GG5M9/8.png",
  "https://i.postimg.cc/JhHCFgKT/9.png",
  "https://i.postimg.cc/DzLYLKxK/10.png",
  "https://i.postimg.cc/DZhpcYN4/11.png",
  "https://i.postimg.cc/VkMFHWnq/12.png"
];

// Copia barajada para mostrar imágenes sin repetir
let baraja = [];

// Función para barajar (Fisher-Yates shuffle)
function barajar(array) {
  let copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function finalizarCompra() {
  // 1. Obtener valores de los campos del modal
  const nombre = document.getElementById('nombreEnvio')?.value.trim();
  const direccion = document.getElementById('direccionEnvio')?.value.trim();
  const metodo = document.getElementById('metodoPago')?.value;

  // 2. Validar que los campos obligatorios estén llenos
  if (!nombre || !direccion || !metodo) {
    alert("Por favor completa todos los campos del formulario de pago.");
    return;
  }

  // 3. Vaciar carrito
  carrito = [];
  actualizarCarrito();

  // 4. Cerrar modal de pago
  document.getElementById('modalPago').style.display = 'none';

  // 5. Mostrar modal de gracias con imagen aleatoria
  const modalGracias = document.getElementById('modalGracias');
  const imgGracias = document.getElementById('imgGracias');

  // Si la baraja está vacía, se vuelve a barajar todo
  if (baraja.length === 0) {
    baraja = barajar(imagenes);
  }

  // Sacar la siguiente imagen de la baraja
  const siguienteImg = baraja.pop();
  imgGracias.src = siguienteImg;

  modalGracias.style.display = 'flex';

  // Cerrar modal manualmente
  document.getElementById('cerrarGracias').onclick = () => {
    modalGracias.style.display = 'none';
  };

  // Cerrar modal automáticamente después de 4 segundos
  setTimeout(() => {
    modalGracias.style.display = 'none';
  }, 4000);
}
