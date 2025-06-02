/**
 * script.js - Funcionalidad de carrito para Chevechita 24/7
 * Este script maneja todas las operaciones relacionadas con el carrito de compras:
 * - Agregar productos al carrito
 * - Guardar/cargar el carrito desde localStorage
 * - Mostrar productos en la página del carrito
 * - Eliminar productos del carrito
 * - Calcular el total a pagar
 */

// Objeto principal que manejará toda la funcionalidad del carrito
const Chevechita = {
  // Propiedad que almacena los productos en el carrito
  carrito: [],
  descuento: 0,
  
  // Inicializa la aplicación según la página en la que estemos
  init: function() {
    this.cargarCarritoDesdeStorage();
    this.actualizarContadorCarrito();
    
    // Comprobar en qué página estamos para ejecutar la funcionalidad correspondiente
    const ruta = window.location.pathname;
    if (ruta.includes('catalogo.html') || ruta.endsWith('/') || ruta.includes('index.html')) {
      this.iniciarCatalogo();
    } else if (ruta.includes('carrito.html')) {
      // En la página del carrito, deshabilitar el script inline y usar solo este
      this.deshabilitarScriptInline();
      this.mostrarProductosEnCarrito();
      this.iniciarEventosCarrito();
      this.verificarCarritoVacio();
    }
  },
  
  // Deshabilita el script inline del HTML para evitar conflictos
  deshabilitarScriptInline: function() {
    // Sobrescribir las variables globales del script inline si existen
    if (window.carritoItems) {
      window.carritoItems = [];
    }
  },
  
  // Inicializa los eventos en la página de catálogo e index
  iniciarCatalogo: function() {
    // Seleccionar todos los botones "Añadir" en la página del catálogo o inicio
    const botonesAgregar = document.querySelectorAll('.añadir-btn, .add-to-cart');
    
    if (botonesAgregar && botonesAgregar.length > 0) {
      botonesAgregar.forEach(boton => {
        // Remover cualquier listener previo para evitar duplicados
        boton.removeEventListener('click', this.handleAgregarClick);
        boton.addEventListener('click', this.handleAgregarClick.bind(this));
      });
    } else {
      console.log("No se encontraron botones de agregar en esta página");
    }
  },

  // Manejador del evento click para los botones "Añadir"
  handleAgregarClick: function(e) {
    e.preventDefault();
    
    const clickedElement = e.target.closest('.añadir-btn') || e.target.closest('.add-to-cart');
    
    if (clickedElement) {
      const producto = this.obtenerDatosProducto(clickedElement);
      if (producto) {
        this.agregarAlCarrito(producto, clickedElement);
      }
    }
  },
  
  // Extrae la información del producto desde el elemento HTML en el catálogo o inicio
  obtenerDatosProducto: function(botonElement) {
    // Buscar el contenedor del producto (puede ser .producto o .product-card)
    const productoElement = botonElement.closest('.producto') || botonElement.closest('.product-card');
    
    if (!productoElement) {
      console.error("No se encontró el elemento padre del producto");
      return null;
    }
    
    // Buscar elementos con diferentes posibles clases
    const nombreElement = productoElement.querySelector('.producto-nombre') || 
                         productoElement.querySelector('.product-title');
    const precioElement = productoElement.querySelector('.producto-precio') || 
                         productoElement.querySelector('.product-price');
    const imagenElement = productoElement.querySelector('.producto-img') || 
                         productoElement.querySelector('.product-image');
    
    if (!nombreElement || !precioElement || !imagenElement) {
      console.error("Faltan elementos esenciales del producto");
      return null;
    }
    
    const nombre = nombreElement.innerText || nombreElement.textContent;
    const precioText = precioElement.innerText || precioElement.textContent;
    const precio = parseFloat(precioText.replace('$', '').replace(/\./g, '').replace(/,/g, ''));
    const imagen = imagenElement.src;
    
    // Buscar detalles del producto
    const detallesElement = productoElement.querySelector('.producto-detalles');
    const detalles = detallesElement ? (detallesElement.innerText || detallesElement.textContent) : 'Producto destacado';
    
    // Obtener ID del producto
    const id = productoElement.dataset.id || nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    
    return {
      id: id,
      nombre: nombre,
      precio: precio,
      imagen: imagen,
      detalles: detalles,
      cantidad: 1
    };
  },
  
  // Agrega un producto al carrito o incrementa su cantidad si ya existe
  agregarAlCarrito: function(producto, botonElement) {
    if (!producto) return;
    
    const index = this.carrito.findIndex(item => item.id === producto.id);
    
    if (index !== -1) {
      this.carrito[index].cantidad++;
    } else {
      this.carrito.push(producto);
    }
    
    this.guardarCarritoEnStorage();
    this.actualizarContadorCarrito();
    this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
    
    if (botonElement) {
      const textoOriginal = botonElement.innerHTML;
      
      botonElement.innerHTML = '<i class="fas fa-check"></i> Añadido';
      botonElement.style.backgroundColor = '#28a745';
      
      setTimeout(() => {
        botonElement.innerHTML = textoOriginal;
        botonElement.style.backgroundColor = '';
      }, 1500);
    }
  },
  
  // Disminuye la cantidad de un producto específico
  disminuirCantidad: function(productoId) {
    const index = this.carrito.findIndex(item => item.id === productoId);
    if (index !== -1 && this.carrito[index].cantidad > 1) {
      this.carrito[index].cantidad--;
      this.guardarCarritoEnStorage();
      this.actualizarContadorCarrito();
      this.actualizarVistaCarrito();
    }
  },
  
  // Aumenta la cantidad de un producto específico
  aumentarCantidad: function(productoId) {
    const index = this.carrito.findIndex(item => item.id === productoId);
    if (index !== -1) {
      this.carrito[index].cantidad++;
      this.guardarCarritoEnStorage();
      this.actualizarContadorCarrito();
      this.actualizarVistaCarrito();
    }
  },
  
  // Elimina un producto del carrito
  eliminarDelCarrito: function(productoId) {
    const cartItem = document.querySelector(`.cart-item[data-id="${productoId}"]`);
    if (cartItem) {
      // Animación de salida
      cartItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      cartItem.style.opacity = '0';
      cartItem.style.transform = 'translateX(-20px)';
      
      setTimeout(() => {
        // Eliminar del array
        this.carrito = this.carrito.filter(producto => producto.id !== productoId);
        this.guardarCarritoEnStorage();
        
        // Remover el elemento del DOM
        if (cartItem.parentNode) {
          cartItem.parentNode.removeChild(cartItem);
        }
        
        // Actualizar toda la interfaz
        this.actualizarContadorCarrito();
        this.calcularYMostrarTotales();
        this.verificarCarritoVacio();
      }, 300);
    }
  },
  
  // Aplica un descuento al total
  aplicarDescuento: function(porcentaje) {
    this.descuento = porcentaje;
    this.calcularYMostrarTotales();
  },
  
  // Guarda el carrito en localStorage
  guardarCarritoEnStorage: function() {
    localStorage.setItem('chevechitaCarrito', JSON.stringify(this.carrito));
    // También mantener compatibilidad con el nombre anterior por si acaso
    localStorage.setItem('carritoItems', JSON.stringify(this.carrito));
  },
  
  // Carga el carrito desde localStorage
  cargarCarritoDesdeStorage: function() {
    let carritoGuardado = localStorage.getItem('chevechitaCarrito');
    
    // Si no existe, intentar cargar del nombre anterior
    if (!carritoGuardado) {
      carritoGuardado = localStorage.getItem('carritoItems');
      if (carritoGuardado) {
        // Migrar al nuevo formato
        localStorage.setItem('chevechitaCarrito', carritoGuardado);
      }
    }
    
    if (carritoGuardado) {
      try {
        this.carrito = JSON.parse(carritoGuardado);
        // Asegurar que todos los productos tengan un ID
        this.carrito = this.carrito.map(producto => {
          if (!producto.id) {
            producto.id = producto.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          }
          return producto;
        });
      } catch (error) {
        console.error("Error al cargar el carrito desde localStorage:", error);
        localStorage.removeItem('chevechitaCarrito');
        localStorage.removeItem('carritoItems');
        this.carrito = [];
      }
    }
  },
  
  // Da formato a los precios
  formatPrice: function(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  },
  
  // Actualiza el contador de productos en el carrito en el menú superior
  actualizarContadorCarrito: function() {
    const contadorElemento = document.querySelector('.cart-count');
    if (contadorElemento) {
      const totalItems = this.carrito.reduce((total, producto) => total + producto.cantidad, 0);
      contadorElemento.textContent = totalItems;
    }
    
    const cartItemsCount = document.querySelector('.cart-items-count');
    if (cartItemsCount) {
      const totalItems = this.carrito.reduce((total, producto) => total + producto.cantidad, 0);
      cartItemsCount.textContent = totalItems;
    }
  },
  
  // Actualiza la vista del carrito en la página carrito.html
  actualizarVistaCarrito: function() {
    this.carrito.forEach(producto => {
      const itemInput = document.querySelector(`.cart-item[data-id="${producto.id}"] .quantity-input`);
      if (itemInput) {
        itemInput.value = producto.cantidad;
      }
    });
    
    this.calcularYMostrarTotales();
    this.actualizarContadorCarrito();
  },
  
  // Verifica si el carrito está vacío y muestra el mensaje apropiado
  verificarCarritoVacio: function() {
    const cartWithItems = document.getElementById('cart-with-items');
    const cartEmpty = document.getElementById('cart-empty');
    
    if (!cartWithItems || !cartEmpty) return;
    
    if (this.carrito.length === 0) {
      cartWithItems.style.display = 'none';
      cartEmpty.style.display = 'block';
    } else {
      cartWithItems.style.display = 'grid';
      cartEmpty.style.display = 'none';
    }
  },
  
  // Calcula y muestra los totales en la página del carrito
  calcularYMostrarTotales: function() {
    const summaryValues = document.querySelectorAll('.cart-summary-value');
    const totalValue = document.querySelector('.cart-summary-total-value');
    
    if (!summaryValues.length || !totalValue) return;
    
    const subtotal = this.carrito.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
    
    const descuentoValor = this.descuento ? (subtotal * this.descuento / 100) : 0;
    const envio = 15000; // Valor fijo en pesos
    const total = subtotal - descuentoValor + envio;
    
    if (summaryValues[0]) summaryValues[0].textContent = '$' + this.formatPrice(subtotal);
    if (summaryValues[1]) summaryValues[1].textContent = '-$' + this.formatPrice(descuentoValor);
    if (summaryValues[2]) summaryValues[2].textContent = '$' + this.formatPrice(envio);
    if (totalValue) totalValue.textContent = '$' + this.formatPrice(total);
  },
  
  // Muestra los productos en la página de carrito.html
  mostrarProductosEnCarrito: function() {
    const carritoContainer = document.querySelector('.cart-items-container');
    if (!carritoContainer) {
      console.error("No se encontró el contenedor del carrito");
      return;
    }
    
    // Limpiar completamente el contenedor
    carritoContainer.innerHTML = '';
    
    // Crear el header
    const header = document.createElement('div');
    header.className = 'cart-items-header';
    header.innerHTML = `
      <h3 class="cart-items-title">
        <i class="fas fa-shopping-cart"></i> Productos en tu carrito
        <span class="cart-items-count">${this.carrito.reduce((total, p) => total + p.cantidad, 0)}</span>
      </h3>
      <a href="catalogo.html" class="cart-continue">
        <i class="fas fa-arrow-left"></i> Seguir comprando
      </a>
    `;
    carritoContainer.appendChild(header);
    
    if (this.carrito.length === 0) {
      this.verificarCarritoVacio();
      return;
    }
    
    // Agregar cada producto
    this.carrito.forEach(producto => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.dataset.id = producto.id;
      
      let detallesHTML = '';
      if (producto.detalles) {
        const detalles = producto.detalles.split('•').map(d => d.trim()).filter(d => d);
        detallesHTML = detalles.map(d => `<span>${d}</span>`).join('');
      }
      
      const imagenSrc = producto.imagen || `img/${producto.id}.jpg`;
      
      cartItem.innerHTML = `
        <img src="${imagenSrc}" alt="${producto.nombre}" class="cart-item-image" onerror="this.src='img/placeholder.jpg';">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${producto.nombre}</h4>
          <div class="cart-item-meta">
            ${detallesHTML}
          </div>
          <p class="cart-item-price">$${this.formatPrice(producto.precio)}</p>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button class="quantity-btn decrease-btn">-</button>
            <input type="number" class="quantity-input" value="${producto.cantidad}" min="1" max="20" readonly>
            <button class="quantity-btn increase-btn">+</button>
          </div>
          <button class="cart-item-remove">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
      
      carritoContainer.appendChild(cartItem);
    });
    
    this.calcularYMostrarTotales();
    this.verificarCarritoVacio();
  },
  
  // Inicializa eventos específicos de la página carrito
  iniciarEventosCarrito: function() {
    // Usar delegación de eventos para manejar elementos dinámicos
    const carritoContainer = document.querySelector('.cart-items-container');
    
    if (carritoContainer) {
      // Remover listeners previos
      carritoContainer.removeEventListener('click', this.handleCartEvents);
      carritoContainer.addEventListener('click', this.handleCartEvents.bind(this));
    }
    
    // Eventos para código promocional y checkout
    const codigoBtn = document.querySelector('.codigo-btn');
    if (codigoBtn) {
      codigoBtn.removeEventListener('click', this.handleCodigoClick);
      codigoBtn.addEventListener('click', this.handleCodigoClick.bind(this));
    }
    
    const checkoutBtn = document.querySelector('.checkout-button');
    if (checkoutBtn) {
      checkoutBtn.removeEventListener('click', this.handleCheckoutClick);
      checkoutBtn.addEventListener('click', this.handleCheckoutClick.bind(this));
    }
  },

  // Maneja todos los eventos del carrito usando delegación
  handleCartEvents: function(e) {
    const target = e.target;
    const cartItem = target.closest('.cart-item');
    
    if (!cartItem) return;
    
    const productoId = cartItem.dataset.id;
    
    if (target.classList.contains('decrease-btn')) {
      e.preventDefault();
      this.disminuirCantidad(productoId);
    } else if (target.classList.contains('increase-btn')) {
      e.preventDefault();
      this.aumentarCantidad(productoId);
    } else if (target.classList.contains('cart-item-remove') || target.closest('.cart-item-remove')) {
      e.preventDefault();
      this.eliminarDelCarrito(productoId);
    }
  },

  handleCodigoClick: function() {
    const codigoInput = document.querySelector('.codigo-input');
    if (codigoInput && codigoInput.value.trim().toLowerCase() === 'descuento10') {
      alert('¡Código promocional aplicado! Has recibido 10% de descuento.');
      codigoInput.disabled = true;
      this.aplicarDescuento(10);
      const codigoBtn = document.querySelector('.codigo-btn');
      if (codigoBtn) {
        codigoBtn.disabled = true;
        codigoBtn.textContent = 'Aplicado';
      }
    } else {
      alert('El código promocional no es válido');
    }
  },

  handleCheckoutClick: function() {
    alert('¡Procesando tu pedido! Pronto recibirás tus bebidas favoritas.');
  },
  
  // Muestra una notificación cuando se agrega un producto al carrito
  mostrarNotificacion: function(mensaje) {
    // Remover notificación anterior si existe
    const notificacionAnterior = document.querySelector('.notificacion');
    if (notificacionAnterior) {
      notificacionAnterior.remove();
    }
    
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
      notificacion.className = 'notificacion visible';
    }, 10);
    
    setTimeout(() => {
      notificacion.className = 'notificacion';
      setTimeout(() => {
        if (notificacion && notificacion.parentNode) {
          document.body.removeChild(notificacion);
        }
      }, 300);
    }, 2000);
  }
};

// Iniciar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  Chevechita.init();
});

// Agregar estilos para la notificación
const estilos = document.createElement('style');
estilos.textContent = `
  .notificacion {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #8B0000;
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
    z-index: 1000;
  }
  
  .notificacion.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(estilos);
