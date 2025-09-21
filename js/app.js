let cart = [];

// Cargar carrito si existe
function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) {
    cart = JSON.parse(saved);
  }
}

// Guardar carrito
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Agregar producto (con variante)
function addToCart(product) {
  // buscar por id y variante (selectedImage)
  const itemInCart = cart.find(
    p => p.id === product.id && p.selectedImage === product.selectedImage
  );

  if (itemInCart) {
    itemInCart.quantity += 1; 
  } else {
    cart.push(product);      
  }

  saveCart();
  updateCartCount();
}


// Actualizar numerito del carrito en navbar
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

// Inicializar carrito
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  updateCartCount();
});


// ================== CARRITO  ==================
function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) {
    cart = JSON.parse(saved);
  } else {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================== MODAL DE IMÁGENES ==================
let currentImages = [];
let modalIndex = 0;

function openModal(images, index) {
  currentImages = images;
  modalIndex = index;
  modal.style.display = "flex";
  showImage(modalIndex);
}

function showImage(index) {
  const temp = new Image();
  temp.onload = () => {
    modalImg.src = temp.src;
  };
  temp.src = currentImages[index];
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

// ================== RENDER DE PRODUCTOS ==================
const container = document.getElementById("products-container");

products.forEach(product => {
  const card = document.createElement("div");
  card.classList.add("card");

  // Imagen principal (carrusel)
  const carousel = document.createElement("div");
  carousel.classList.add("carousel");

  const img = document.createElement("img");
  img.src = product.images[0];
  img.alt = product.name;
  carousel.appendChild(img);

let currentIndex = 0;
let carouselInterval;
let userSelected = false;

// Carrusel automático
carouselInterval = setInterval(() => {
  if (!userSelected) {  // solo corre si no hubo click
    currentIndex = (currentIndex + 1) % product.images.length;
    img.src = product.images[currentIndex];
    // 🚫 ya no toca las miniaturas
  }
}, 3000);


  // Abrir modal al hacer click en la imagen principal
  carousel.addEventListener("click", () => {
    openModal(product.images, currentIndex);
  });

  // Miniaturas
  const thumbs = document.createElement("div");
  thumbs.classList.add("thumbnails");

 product.images.forEach((thumbSrc, index) => {
  const thumb = document.createElement("img");
  thumb.src = thumbSrc;
  thumb.alt = `${product.name} variante ${index + 1}`;
  thumb.classList.add("thumb");

thumb.addEventListener("click", () => {
  img.src = thumbSrc;
  currentIndex = index;

  // Quitar selección previa
  thumbs.querySelectorAll(".thumb").forEach(t => t.classList.remove("selected"));
  thumb.classList.add("selected");

  // Marcar que el usuario ya eligió y detener el carrusel
  userSelected = true;
  clearInterval(carouselInterval);
});

  // Doble click en miniatura = abrir modal
  thumb.addEventListener("dblclick", () => {
    openModal(product.images, index);
  });

  thumbs.appendChild(thumb);
});

  // Info del producto
  const info = document.createElement("div");
  info.classList.add("info");
  info.innerHTML = `
    <h3>${product.name}</h3>
    <p>Talle: ${product.textotalla}</p>
    <p><strong>$${product.price}</strong></p>
    <button class="add-btn">Agregar al carrito</button>
  `;

  // Agregar al carrito con variante seleccionada
  const addBtn = info.querySelector(".add-btn");
  addBtn.addEventListener("click", () => {
    const selectedImage = product.images[currentIndex];
    const item = {
      ...product,
      selectedImage,
      quantity: 1
    };
    addToCart(item);
  });

  card.appendChild(carousel);
  card.appendChild(thumbs);
  card.appendChild(info);
  container.appendChild(card);
});



document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});