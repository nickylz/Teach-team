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

  // ✅ Validar sesión
  if (!localStorage.getItem('usuario')) {
    // Abrir modal de login si no hay sesión
    const modal = document.getElementById('modalLogin');
    modal.style.display = 'flex';
    document.getElementById('usuario').focus();
    return; // no mete al carrito hasta que inicie sesión
  }

  // ✅ Si hay sesión → mete producto al carrito
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
  "https://i.pinimg.com/736x/f7/17/32/f71732abaf2c9f2f8003330e1e89a9b0.jpg",
  "https://i.pinimg.com/736x/99/4f/bf/994fbf99a1728dc3c3b3d526eb873666.jpg",
  "https://i.pinimg.com/736x/37/e1/b0/37e1b0b70894b2451986df62b75b726b.jpg",
  "https://i.pinimg.com/736x/6e/79/d4/6e79d48ce42244179361f12cea197182.jpg",
  "https://i.pinimg.com/736x/72/7e/f8/727ef8b575ec9168c04f12d0246d383a.jpg",
  "https://i.pinimg.com/736x/a8/64/bd/a864bd2854ce4d2516c42d2b8caf43d0.jpg",
  "https://i.pinimg.com/736x/ee/fb/ef/eefbef3b5c4823a26374a64a91c1df25.jpg",
  "https://i.pinimg.com/736x/bc/1f/b5/bc1fb5d2764a43477649cac888960b12.jpg",
  "https://i.pinimg.com/736x/00/c5/6e/00c56e6710ed39eb4723d38bd5242b6c.jpg",
  "https://i.pinimg.com/736x/a9/24/ee/a924ee07c8e622aa1f9e4ef4f5c10be7.jpg",
  "https://i.pinimg.com/736x/43/43/eb/4343eb103ae09dc6f55539528edbbf02.jpg",
  "https://i.pinimg.com/1200x/e1/c4/7d/e1c47d189f0a84b596562db88bf60e29.jpg"
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
