// --- JS BOTÓN FLOTANTE Y MODAL DE FAQ ---
document.addEventListener('DOMContentLoaded', function() {
    const floatBtn = document.getElementById('whatsapp-btn-float');
    const modal = document.getElementById('contact-modal');
    const closeModal = document.getElementById('close-modal');
    const faqToggle = document.getElementById('modal-faq-toggle');
    const faqSeccion = document.getElementById('faq-seccion');
    const modalWhatsappLink = document.getElementById('modal-whatsapp-link');

    // Muestra el modal
    floatBtn.onclick = function() {
        modal.style.display = 'flex';
    }

    // Oculta el modal
    closeModal.onclick = function() {
        modal.style.display = 'none';
        faqSeccion.style.display = 'none'; // Asegura que el FAQ se oculte
    }
    
    // Cierra el modal si se hace clic fuera del contenido
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            faqSeccion.style.display = 'none'; // Asegura que el FAQ se oculte
        }
    }

    // Toggle para mostrar/ocultar el FAQ
    faqToggle.onclick = function() {
        if (faqSeccion.style.display === 'none' || faqSeccion.style.display === '') {
            faqSeccion.style.display = 'block';
            faqToggle.innerHTML = '<i class="fas fa-times-circle"></i> Ocultar Preguntas';
        } else {
            faqSeccion.style.display = 'none';
            faqToggle.innerHTML = '<i class="fas fa-question-circle"></i> Preguntas Frecuentes';
        }
    }
    
    // Enlazar el botón de WhatsApp del modal al número
    const numero = "51935643297"; // ¡Cámbialo si es necesario!
    const mensajeInicial = 'Hola, quisiera hacer una consulta sobre los productos.';
    modalWhatsappLink.href = `https://wa.me/${numero}?text=${encodeURIComponent(mensajeInicial)}`;
    
    // Opcional: Cerrar modal al hacer clic en el enlace de WhatsApp
    modalWhatsappLink.onclick = function() {
        setTimeout(() => {
            modal.style.display = 'none';
            faqSeccion.style.display = 'none';
        }, 300); // Pequeña pausa antes de cerrar
    }
});
// --- FIN JS BOTÓN FLOTANTE Y MODAL DE FAQ ---
  // --- JS PARA LA PANTALLA DE INTRODUCCIÓN ---
window.addEventListener('load', function() {
    const splash = document.getElementById('intro-splash');
    
    // Configura la duración de la intro (tiempo fijo que quieres mostrarla)
    const duracionIntro = 3000; // 3000ms = 3 segundos
    
    // Función que inicia el desvanecimiento
    const hideSplash = () => {
        splash.classList.add('hidden');
        // Opcional: una vez oculta, puedes eliminarla del DOM para que no afecte clics.
        setTimeout(() => {
             splash.remove();
        }, 1000); // Espera 1s (igual a la duración de la transición CSS)
    };
    
    // Espera el tiempo fijo y luego oculta
    setTimeout(hideSplash, duracionIntro);
});
// --- FIN JS INTRO ---
    
    // 
    const GAS_URL_PEDIDO = 'https://script.google.com/macros/s/AKfycbzW6TmM1jiRPMp6437p9xXWZYeo5krV9Lx8krxtm0rs11HjOgOirstlPpgrpXpfpXwx7w/exec';
    
    let carrito = [];
    let total = 0;
  
    // Variables de color para JS
    const rootStyles = getComputedStyle(document.documentElement);
    const COLOR_EXITO = rootStyles.getPropertyValue('--color-exito').trim();
    const COLOR_PRINCIPAL = rootStyles.getPropertyValue('--color-principal').trim();
    const COLOR_ACENTO = rootStyles.getPropertyValue('--color-acento').trim();

    
    // Lista de productos integrada
    const productos = [
      { "nombre": "Fresa", "precio": 10, "imagen": "imgs/fresa.jpg","unidad": "x 1 Lt" },
      { "nombre": "Guanabana", "precio": 10, "imagen": "imgs/guanabana.jpg","unidad": "x 1 Lt" },
      { "nombre": "Piña", "precio": 10, "imagen": "imgs/piña.jpg","unidad": "x 1 Lt" },
      { "nombre": "Durazno", "precio": 10, "imagen": "imgs/durazno.jpg","unidad": "x 1 Lt" },
      { "nombre": "Lúcuma", "precio": 10, "imagen": "imgs/lucma.jpg","unidad": "x 1 Lt" },
      { "nombre": "Vainilla", "precio": 10, "imagen": "imgs/vainilla.jpg","unidad": "x 1 Lt" },
      { "nombre": "Natural", "precio": 9.5, "imagen": "imgs/natural.jpg","unidad": "x 1 Lt" }, 
      { "nombre": "Arándano", "precio": 12, "imagen": "imgs/arandanos.jpg","unidad": "x 1 Lt" }
    ];

    function cargarProductos() {
    const contenedor = document.getElementById("productos");
    productos.forEach((prod, index) => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <h3>${prod.nombre}</h3>
        <p>S/ ${prod.precio} <span class="unidad-medida">${prod.unidad}</span></p>
        <div class="extras">             <label><input type="checkbox" value="Chía"><span></span> + Chía (+S/1)</label>
          <label><input type="checkbox" value="Linaza"><span></span> + Linaza (+S/1)</label>
          <label><input type="checkbox" value="Cereal"><span></span> + Cereal (+S/2)</label>
          <label><input type="checkbox" value="Granola"><span></span> + Granola (+S/9)<label>
        </div>
        <button class="agregar" onclick="agregarCarrito(${index}, this)"><i class="fas fa-plus-circle"></i> Añadir</button>
      `;
      contenedor.appendChild(div);
    });
}

    // *** FUNCIÓN MODIFICADA: Agrupa productos idénticos ***
    function agregarCarrito(index, btn) {
      const producto = productos[index];
      const card = btn.parentElement;

      let extras = [];
      let extraPrecio = 0;

      card.querySelectorAll("input[type=checkbox]").forEach(chk => {
        if (chk.checked) {
          extras.push(chk.value);
          extraPrecio += (chk.value === "Cereal" ? 2 : 1);
          // Desmarcar para el siguiente uso
          chk.checked = false; 
        }
      });

      const precioUnitario = parseFloat((producto.precio + extraPrecio).toFixed(2));
      
      // Crea una 'clave' única para el producto + extras
      const clave = producto.nombre + (extras.length > 0 ? "_" + extras.sort().join("_") : "");

      // Busca si el item ya existe en el carrito
      const itemExistente = carrito.find(item => item.clave === clave);

      if (itemExistente) {
        // Si existe, solo incrementa la cantidad
        itemExistente.cantidad++;
        itemExistente.precio = parseFloat((itemExistente.cantidad * precioUnitario).toFixed(2)); // Actualiza el total del grupo
      } else {
        // Si no existe, añade un nuevo item
        const item = {
          clave: clave, // La clave única para agrupar
          nombre: producto.nombre,
          precioUnitario: precioUnitario, // Precio de UNA unidad
          precio: precioUnitario, // Precio inicial (1 unidad)
          extras: extras,
          cantidad: 1
        };
        carrito.push(item);
      }

      total = parseFloat((total + precioUnitario).toFixed(2));
      actualizarCarrito();
    }

    // *** FUNCIÓN MODIFICADA: Muestra cantidad en el listado ***
    function actualizarCarrito() {
      const lista = document.getElementById("lista-carrito");
      lista.innerHTML = "";
      
      if (carrito.length === 0) {
        document.getElementById('pedido-vacio').style.display = 'block';
        document.getElementById('finalizar').disabled = true;
      } else {
        document.getElementById('pedido-vacio').style.display = 'none';
        document.getElementById('finalizar').disabled = false;
      }
      
      // Recalcula el total a partir de los items agrupados para asegurar coherencia
      total = carrito.reduce((sum, item) => sum + item.precio, 0);

      carrito.forEach((item, i) => {
        const li = document.createElement("li");
        
        let detalleProducto = `*${item.cantidad} x ${item.nombre}`;
        if (item.extras.length > 0) {
          detalleProducto += ` (+${item.extras.join(", ")})`;
        }

        li.innerHTML = `
          <span>
            <strong>${detalleProducto}</strong>
            <small class="precio-unitario">(S/${item.precioUnitario.toFixed(2)} c/u)</small>
          </span>
          <span>
            S/ ${item.precio.toFixed(2)}
            <button class="eliminar" onclick="eliminarItem(${i})" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
          </span> 
        `;
        lista.appendChild(li);
      });
      
      document.getElementById("total").textContent = total.toFixed(2);
    }

    // *** FUNCIÓN MODIFICADA: Elimina por completo el grupo de productos. ***
    function eliminarItem(index) {
        // Al eliminar, restamos el total del grupo completo
        total = parseFloat((total - carrito[index].precio).toFixed(2)); 
        carrito.splice(index, 1);
        actualizarCarrito();
    }

     /**
     * Función que REGISTRA de forma ASÍNCRONA y abre WhatsApp INMEDIATAMENTE.
     */
    function enviarPedido() {
      const btn = document.getElementById("finalizar");
      const statusDiv = document.getElementById('registro-status');
      const originalText = btn.innerHTML;
      
      // --- 1. VALIDACIÓN INICIAL ---
      if (carrito.length === 0) {
        statusDiv.style.display = 'block';
        statusDiv.textContent = '¡El carrito está vacío!';
        statusDiv.style.color = COLOR_ACENTO;
        setTimeout(() => statusDiv.style.display = 'none', 3000);
        return;
      }
      
      const nombre = document.getElementById('nombre_pedido').value.trim();
      const telefono = document.getElementById('telefono_pedido').value.trim();
      const direccion = document.getElementById('direccion_pedido').value.trim();
      const pedidoDetallado = generarTextoPedido();
      const totalPedido = total.toFixed(2);

      if (!nombre || !telefono || !direccion) {
        statusDiv.style.display = 'block';
        statusDiv.textContent = '⚠️ Completa tus datos de contacto.';
        statusDiv.style.color = '#e74c3c';
        setTimeout(() => statusDiv.style.display = 'none', 3000);
        return;
      }
      
      // --- 2. PREPARACIÓN E INDICADOR DE PROCESO ---
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
      btn.disabled = true;

      // Mostramos el mensaje UNIFICADO de éxito de UX (Enfocando en WhatsApp)
      statusDiv.style.display = 'block';
      statusDiv.textContent = '¡Gracias! Tu solicitud ha sido recibida. Revisa tu WhatsApp.';
      statusDiv.style.color = COLOR_EXITO; // Verde de éxito

      // --- 3. ENVÍO INDEPENDIENTE A GOOGLE SHEETS (NO BLOQUEANTE) ---
      const dataSheets = {
        nombre: nombre, 
        pedido: pedidoDetallado,
        total: totalPedido,
        direccion: direccion,
        telefono: telefono
      };

      if (GAS_URL_PEDIDO.length === 0) { 
        console.error("Error: Falta configurar la variable GAS_URL_PEDIDO. Solo se enviará por WhatsApp.");
      } else {
        // Ejecutar fetch sin 'await' para que corra en segundo plano
        fetch(GAS_URL_PEDIDO, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(dataSheets)
        })
        .then(response => response.json())
        .then(result => {
            // Registro exitoso (solo para log interno)
            console.log('✅ Registro en Sheets OK:', result);
        })
        .catch(error => {
            // Error de red o GAS (solo para log interno)
            console.error('❌ Error de red o GAS al guardar. WhatsApp se envió de todas formas.', error);
        });
      }

      // --- 4. ABRIR WHATSAPP INMEDIATAMENTE (Flujo principal de UX) ---
      const mensajeWhatsApp = generarMensajeWhatsApp(nombre, telefono, direccion, totalPedido);
      
      const numero = "51935643297"; // ¡CAMBIA ESTE NÚMERO POR EL TUYO!
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensajeWhatsApp)}`;
      
      // Breve pausa visual antes de abrir
      setTimeout(() => {
        window.open(url, "_blank");
        // Limpiar interfaz después de abrir WhatsApp
        limpiarPedido();
      }, 1500); // Damos 1.5s para que el usuario lea el mensaje de éxito

      // --- 5. Restablecer el botón ---
      setTimeout(() => {
        statusDiv.style.display = 'none';
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 5000);
    }

    // *** FUNCIÓN MODIFICADA ***
    function generarTextoPedido() {
      // Cada producto se une con un salto de línea para mejor visualización en Sheets
      return carrito.map(item => {
        let detalle = `- ${item.cantidad}x${item.nombre}`; // Añadir guion para lista
        if (item.extras.length > 0) {
          detalle += ` (+${item.extras.join(", ")})`;
        }
        detalle += ` [S/${item.precio.toFixed(2)}]`;
        return detalle;
      }).join('\n'); // <-- CAMBIO CLAVE: Usa '\n' (salto de línea) en lugar de ' | '
    }

    function generarMensajeWhatsApp(nombre, telefono, direccion, totalPedido) {
      let mensaje = `¡Hola! Quisiera realizar mi pedido.\n\nMi nombre es *${nombre}* y este es el detalle:\n\n*📝 Detalle del Pedido:*\n`;
      const emojiItem = '➤';
      
      carrito.forEach(item => {
        mensaje += `${emojiItem} *${item.cantidad}x* ${item.nombre}${item.extras.length > 0 ? " (+" + item.extras.join(", ") + ")" : ""} - S/ ${item.precio.toFixed(2)}\n`;
      });
      
      mensaje += `\n*TOTAL: S/ ${totalPedido}*\n\n`;
      mensaje += `*Datos para el Delivery:*\n📞 Teléfono: ${telefono}\n📍 Dirección: ${direccion}`;
      return mensaje;
    }

    function limpiarPedido() {
      carrito = [];
      total = 0;
      actualizarCarrito();
      document.getElementById('nombre_pedido').value = '';
      document.getElementById('telefono_pedido').value = '';
      document.getElementById('direccion_pedido').value = '';
      // Dejamos el statusDiv para que el cliente lea el mensaje de éxito unificado por un tiempo
    }
    cargarProductos();