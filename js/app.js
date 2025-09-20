let cart = [];

// ================== CARRITO ==================

// Agregar al carrito con cantidades
document.addEventListener("click", e => {
  if (e.target.classList.contains("add-btn")) {
    const id = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === id);

    const itemInCart = cart.find(item => item.id === id);

    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    renderCart();
  }
});

// Render carrito
function renderCart() {
  const cartList = document.getElementById("cart-list");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartList.innerHTML = "";
  let total = 0;
  let itemsCount = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} (x${item.quantity}) - $${item.price * item.quantity}`;
    cartList.appendChild(li);

    total += item.price * item.quantity;
    itemsCount += item.quantity;
  });

  cartCount.textContent = itemsCount;
  cartTotal.textContent = `Total: $${total}`;
}

// Finalizar compra por WhatsApp
document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let message = "Hola! Quiero hacer un pedido:\n";
  let total = 0;

  cart.forEach(item => {
    message += `- ${item.name} (x${item.quantity}) - $${item.price * item.quantity}\n`;
    total += item.price * item.quantity;
  });

  message += `\nTotal: $${total}`;

  const phone = "549XXXXXXXXXX"; // <-- tu número con código de país
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
});

// ================== MODAL DE IMÁGENES ==================
let currentImages = [];
let modalIndex = 0;

function showImage(index) {
  const temp = new Image();
  temp.onload = () => {
    modalImg.src = temp.src;
  };
  temp.src = currentImages[index];
}


function openModal(images, index) {
  currentImages = images;
  modalIndex = index;
  modal.style.display = "flex";
  showImage(modalIndex);
}

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

closeBtn.onclick = () => modal.style.display = "none";

prevBtn.onclick = () => {
  modalIndex = (modalIndex - 1 + currentImages.length) % currentImages.length;
  showImage(modalIndex);
};

nextBtn.onclick = () => {
  modalIndex = (modalIndex + 1) % currentImages.length;
  showImage(modalIndex);
};

modal.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// Render de productos
const container = document.getElementById("products-container");

products.forEach(product => {
  const card = document.createElement("div");
  card.classList.add("card");

  // Carrusel de imágenes (con cambio automático)
  const carousel = document.createElement("div");
  carousel.classList.add("carousel");

  const img = document.createElement("img");
  img.src = product.images[0];
  img.alt = product.name;
  carousel.appendChild(img);

  let currentIndex = 0;
  setInterval(() => {
    currentIndex = (currentIndex + 1) % product.images.length;
    img.src = product.images[currentIndex];
  }, 3000);

  // Info del producto
  const info = document.createElement("div");
  info.classList.add("info");
  info.innerHTML = `
    <h3>${product.name}</h3>
    <p>Talle del ${product.talla}</p>
    <p><strong>$${product.price}</strong></p>
    <button class="add-btn" data-id="${product.id}">Agregar al carrito</button>
  `;

  card.appendChild(carousel);
  card.appendChild(info);
  container.appendChild(card);

  // Abrir modal al hacer clic en la imagen
  carousel.addEventListener("click", () => {
    openModal(product.images, currentIndex);
  });
});
