class Producto {
  constructor(id, nombre, descripcion, estrellas, precio, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estrellas = estrellas;
    this.precio = precio;
    this.imagen = imagen;
  }
}

class Carrito {
  constructor() {
    const carritoGuardado = localStorage.getItem('carrito'); //persistencia de datos de manera local (cerrar ventana/cargar página)
    this.items = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    this.mostrarCarrito();
    this.actualizarContador();
  }

  agregarProducto(id) {
    const producto = productos.find((prod) => prod.id === id);
    if (!producto) return;

    const itemEncontrado = this.items.find(
      (item) => item.producto.id === producto.id
    );
    if (itemEncontrado) {
      itemEncontrado.cantidad++;
    } else {
      this.items.push({ producto, cantidad: 1 });
    }

    this.guardarCarrito();
    this.mostrarCarrito();
    this.actualizarContador();
  }

  cambiarCantidad(id, cantidad) {
    const itemEncontrado = this.items.find((item) => item.producto.id === id);
    if (itemEncontrado) {
      itemEncontrado.cantidad += cantidad;
      if (itemEncontrado.cantidad <= 0) {
        this.eliminarProducto(id);
      } else {
        this.guardarCarrito();
        this.mostrarCarrito();
      }
    }
  }

  actualizarContador() {
    const contador = document.querySelector('.icon-cart span');
    contador.textContent = this.items.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  }

  eliminarProducto(id) {
    this.items = this.items.filter((item) => item.producto.id !== id);
    this.guardarCarrito();
    this.mostrarCarrito();
    this.actualizarContador();
  }

  calcularTotal() {
    return this.items.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
  }

  mostrarCarrito() {
    const carritoDiv = document.querySelector('.list-cart');
    carritoDiv.innerHTML = '';

    this.items.forEach((item) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item';
      itemDiv.innerHTML = `
        <div class="image"><img src="${item.producto.imagen}" alt="${
        item.producto.nombre
      }"></div>
        <div class="name">${item.producto.nombre}</div>
        <div class="total-price">$${item.producto.precio}</div>
        <div class="quantity">
             <button class="minus" onclick="carrito.cambiarCantidad(${
               item.producto.id
             }, -1)" ${item.cantidad === 1 ? 'disabled' : ''}>-</button>
            <span>${item.cantidad}</span>
            <button class="plus" onclick="carrito.agregarProducto(${
              item.producto.id
            })">+</button>
        </div>
        <div class="delete-product" onclick="carrito.eliminarProducto(${
          item.producto.id
        })">X</div>
      `;
      carritoDiv.appendChild(itemDiv);
    });

    document.getElementById(
      'total'
    ).textContent = `Total: $${this.calcularTotal().toFixed(2)}`;
  }

  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.items));
  }
}

let carrito;
document.addEventListener('DOMContentLoaded', function () {
  carrito = new Carrito();
  cargarProductos();

  // Agregar el event listener para el botón de búsqueda
  document
    .querySelector('.search-button')
    .addEventListener('click', buscarProductos);

  // Agregar el event listener para el campo de búsqueda al presionar Enter
  document.querySelector('.search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      buscarProductos();
    }
  });
});

let productos = [];
let currentPage = 1;
const productsPerPage = 6;

async function cargarProductos() {
  try {
    const response = await fetch('bd.json');
    productos = await response.json();
    mostrarProductos(productos);
    actualizarPaginacion();
  } catch (error) {
    console.error('Error al cargar productos:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al cargar productos',
      text: 'No se pudo cargar la lista de productos. Intenta de nuevo más tarde.',
    });
  }
}

function mostrarProductos(productosParaMostrar = productos) {
  const productosDiv = document.getElementById('productos');
  productosDiv.innerHTML = '';

  // Calcular el índice de los productos para la página actual
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const productosPagina = productosParaMostrar.slice(start, end);

  productosPagina.forEach((producto) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="product-info">
          <h2>${producto.nombre}</h2>
          <p class="description">${producto.descripcion}</p>
          <img class="estrellas" src="${producto.estrellas}" alt="Imagen-estrellas">
          <p class="price">$${producto.precio}</p>
          <button class="add-product" data-id="${producto.id}">Agregar al carrito</button>
        </div>
      `;
    productosDiv.appendChild(productCard);
  });

  // Agrega un listener de clic a los botones de agregar al carrito
  document.querySelectorAll('.add-product').forEach((button) => {
    button.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'), 10);
      carrito.agregarProducto(id);
    });
  });

  actualizarPaginacion();
}

//Mostrar y ocultar el carrito
document.querySelector('.icon-cart').addEventListener('click', () => {
  document.getElementById('carrito').classList.toggle('show');
});

document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('carrito').classList.remove('show');
});

// Método para vaciar el carrito
function vaciarCarrito() {
  carrito.items = [];
  carrito.guardarCarrito();
  carrito.mostrarCarrito();
  carrito.actualizarContador();
}

// Añadir eventos a los botones del carrito
document.querySelector('.clear-cart').addEventListener('click', vaciarCarrito);

//Función para cerrar el carrito con la x
function toggleCarrito() {
  const carrito = document.getElementById('carrito');
  carrito.classList.toggle('show');
}

// Función para actualizar la paginación
function actualizarPaginacion() {
  const totalPages = Math.ceil(productos.length / productsPerPage);
  document.getElementById(
    'page-info'
  ).textContent = `${currentPage} de ${totalPages}`;

  // Deshabilitar o habilitar botones de paginación
  document.getElementById('prev-page').disabled = currentPage === 1;
  document.getElementById('next-page').disabled = currentPage === totalPages;
  document.getElementById('first-page').disabled = currentPage === 1;
  document.getElementById('last-page').disabled = currentPage === totalPages;
}

// Controladores de eventos para los botones de paginación
document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    mostrarProductos();
    actualizarPaginacion();
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  const totalPages = Math.ceil(productos.length / productsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    mostrarProductos();
    actualizarPaginacion();
  }
});

document.getElementById('first-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage = 1;
    mostrarProductos();
    actualizarPaginacion();
  }
});

document.getElementById('last-page').addEventListener('click', () => {
  const totalPages = Math.ceil(productos.length / productsPerPage);
  if (currentPage < totalPages) {
    currentPage = totalPages;
    mostrarProductos();
    actualizarPaginacion();
  }
});

//Buscador de productos
function buscarProductos() {
  const productoBuscado = document
    .querySelector('.search-input')
    .value.toLowerCase();
  const volverBusquedaBtn = document.getElementById('volver-busqueda');
  const mensajeNoEncontrado = document.getElementById('mensaje-no-encontrado');

  //Filtra los productos en funcion del producto buscado
  const productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(productoBuscado) ||
      producto.descripcion.toLowerCase().includes(productoBuscado)
  );

  // Mostrar el botón "Volver" solo si hay un término de búsqueda activo
  volverBusquedaBtn.style.display = productoBuscado ? 'inline-block' : 'none';

  // Mostrar mensaje si no se encuentran productos
  mensajeNoEncontrado.style.display =
    productosFiltrados.length === 0 ? 'block' : 'none';

  currentPage = 1; // Resetear a la primera página
  mostrarProductos(productosFiltrados);
}

// Funcionalidad del botón volver
document.getElementById('volver-busqueda').addEventListener('click', () => {
  document.querySelector('.search-input').value = '';
  currentPage = 1;
  mostrarProductos(productos);
  document.getElementById('volver-busqueda').style.display = 'none';
});

// Inicializar la carga de productos al cargar la página
cargarProductos();
