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
      <p><strong>${item.name}</strong> (Talle del ${item.textotalla})</p>
      <p>Precio: $${item.price}</p>
    `;
    li.appendChild(info);

    // Select de talles (si tiene)
    if (Array.isArray(item.talles) && item.talles.length > 0) {
      const select = document.createElement("select");
      select.classList.add("talle-select");

      item.talles.forEach(talle => {
        const option = document.createElement("option");
        option.value = talle;
        option.textContent = talle;

        if (item.selectedTalle === talle) {
          option.selected = true;
        }

        select.appendChild(option);
      });

      select.addEventListener("change", e => {
        item.selectedTalle = e.target.value;
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
}



// ================== VACIAR CARRITO ==================
function clearCart() {
  cart = [];                    
  localStorage.removeItem("cart");  
  renderCart();                     
}

// ================== CHECKOUT WHATSAPP ==================
function checkout() {
  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let message = "Hola! Quiero hacer un pedido:\n";
  let total = 0;

  cart.forEach(item => {
    message += `- ${item.name} (x${item.quantity}) - $${item.price * item.quantity}`;

    // 👇 Si el producto tiene talle seleccionado, lo mostramos
    if (item.selectedTalle) {
      message += ` | Talle: ${item.selectedTalle}`;
    }

    message += "\n";
    total += item.price * item.quantity;
  });

  message += `\nTotal: $${total}`;

  const phone = "5493765136870"; //
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}

// ================== INICIALIZAR ==================
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderCart();

  // Botón checkout
  const checkoutBtn = document.getElementById("checkout");
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
