let cart = [];

// ================== CARGAR CARRITO ==================
function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) {
    cart = JSON.parse(saved);
  }
}

// ================== GUARDAR CARRITO ==================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");

  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("cart-item");

    // Imagen
    const img = document.createElement("img");
    img.src = item.images[0];
    img.alt = item.name;
    img.classList.add("cart-img");
    li.appendChild(img);

    // Info
    const info = document.createElement("div");
    info.classList.add("cart-info");
    info.innerHTML = `
      <p><strong>${item.name}</strong> (Talla del ${item.textotalla})</p>
      <p>Precio: $${item.price}</p>
    `;
    li.appendChild(info);

    // Select de talles (si tiene)
  if (Array.isArray(item.tallas) && item.tallas.length > 0) {
    const select = document.createElement("select");
    select.classList.add("tallas-select");
  
    item.tallas.forEach(talla => {
      const option = document.createElement("option");
      option.value = talla;
      option.textContent = talla;
  
      if (item.selectedTalla === talla) {
        option.selected = true;
      }
  
      select.appendChild(option);
    });
  
    select.addEventListener("change", e => {
      item.selectedTalla = e.target.value;
      saveCart();
    });
  
    li.appendChild(select);
  }

    // Controles cantidad
    const controls = document.createElement("div");
    controls.classList.add("cart-controls");
    controls.innerHTML = `
      <button class="qty-btn" data-action="decrease">-</button>
      <span>${item.quantity}</span>
      <button class="qty-btn" data-action="increase">+</button>
      <span>$${item.price * item.quantity}</span>
    `;

    controls.querySelector("[data-action='decrease']").addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart = cart.filter(p => p.id !== item.id);
      }
      saveCart();
      renderCart();
    });

    controls.querySelector("[data-action='increase']").addEventListener("click", () => {
      item.quantity++;
      saveCart();
      renderCart();
    });

    li.appendChild(controls);
    cartList.appendChild(li);

    total += item.price * item.quantity;
  });

  cartTotal.textContent = `Total: $${total}`;

  // 🔑 Mostrar / ocultar botones según carrito
  const checkoutBtn = document.querySelector(".btn-whatsapp");
  const clearBtn = document.getElementById("btnClear");

  if (cart.length === 0) {
    if (checkoutBtn) checkoutBtn.style.display = "none";
    if (clearBtn) clearBtn.style.display = "none";
  } else {
    if (checkoutBtn) checkoutBtn.style.display = "inline-block";
    if (clearBtn) clearBtn.style.display = "inline-block";
  }
}

// ================== VACIAR CARRITO ==================
function clearCart() {
  cart = [];                    
  localStorage.removeItem("cart");  
  renderCart();                     
}

// ================== CHECKOUT WHATSAPP ==================
function checkout(event) {
  if (event) event.preventDefault();

  if (cart.length === 0) {
    mostrarAviso("⚠️ El carrito está vacío.");
    return;
  }

  const form = document.getElementById("shippingForm");
  if (!form) {
    mostrarAviso("⚠️ No se encontró el formulario de envío.");
    return;
  }

  // Validación manual: buscar el primer campo vacío que tenga `required`
  const campos = form.querySelectorAll("[required]");
  for (let campo of campos) {
    if (!campo.value.trim()) {
      mostrarAviso(`⚠️ Debes completar: ${campo.previousElementSibling?.textContent || "un campo requerido"}`);
      return;
    }
  }

  // ✅ Si llegamos acá, el formulario está completo
  const formData = new FormData(form);
  const cliente = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    street: formData.get("street"),
    number: formData.get("number"),
    city: formData.get("city"),
    province: formData.get("province"),
    zip: formData.get("zip"),
    notes: formData.get("notes") || ""
  };

  // Productos
  let message = `Hola! Quiero hacer un pedido:\n\n`;
  let total = 0;

  cart.forEach(item => {
    message += `- ${item.name} (x${item.quantity}) - $${item.price * item.quantity}`;
    if (item.selectedTalla) {
      message += ` | Talla: ${item.selectedTalla}`;
    }
    message += "\n";
    total += item.price * item.quantity;
  });

  message += `\n💰 Total: $${total}\n\n`;
  message += `📦 Datos de envío:\n`;
  message += `👤 Nombre: ${cliente.name}\n`;
  message += `📱 Teléfono: ${cliente.phone}\n`;
  message += `📧 Email: ${cliente.email}\n`;
  message += `🏠 Dirección: ${cliente.street} ${cliente.number}, ${cliente.city}, ${cliente.province}, CP ${cliente.zip}\n`;
  if (cliente.notes) message += `📌 Referencias: ${cliente.notes}\n`;

  const phone = "5493765136870";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function mostrarAviso(texto) {
  let aviso = document.getElementById("avisoFormulario");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "avisoFormulario";
    document.body.appendChild(aviso);
  }

  aviso.textContent = texto;

  // 🔑 estilos fijos al viewport
  Object.assign(aviso.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#d95583",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    zIndex: "999999",     // más alto que todo
    opacity: "1",
    transition: "opacity 0.3s ease",
    maxWidth: "90%",
    textAlign: "center"
  });

  // reset animación si estaba mostrándose
  aviso.style.display = "block";
  aviso.style.opacity = "1";

  // ocultar después de 4s
  setTimeout(() => {
    aviso.style.opacity = "0";
    setTimeout(() => {
      aviso.style.display = "none";
    }, 300);
  }, 5000);
}


// ================== INICIALIZAR ==================
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderCart();

  // Botón Finalizar compra (WhatsApp)
  const checkoutBtn = document.querySelector(".btn-whatsapp");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }

  // Botón vaciar carrito
  const clearBtn = document.getElementById("btnClear");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearCart);
  }

  // Delegación para botones ➕➖
  document.getElementById("cart-list").addEventListener("click", e => {
    if (e.target.classList.contains("qty-btn")) {
      const id = parseInt(e.target.dataset.id);
      const action = e.target.dataset.action;
      const item = cart.find(p => p.id === id);

      if (item) {
        if (action === "increase") {
          item.quantity++;
        } else if (action === "decrease") {
          item.quantity--;
          if (item.quantity <= 0) {
            cart = cart.filter(p => p.id !== id);
          }
        }
        saveCart();
        renderCart();
      }
    }
  });
});




