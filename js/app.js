let cart = [];

// ================== CARRITO ==================
// Cargar carrito si existe
function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) {
    cart = JSON.parse(saved);
  } else {
    cart = [];
  }
}

// Guardar carrito
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Agregar producto (con variante)
function addToCart(product) {
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
  card.dataset.category = product.category;

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
    if (!userSelected) {
      currentIndex = (currentIndex + 1) % product.images.length;
      img.src = product.images[currentIndex];
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

      thumbs.querySelectorAll(".thumb").forEach(t => t.classList.remove("selected"));
      thumb.classList.add("selected");

      userSelected = true;
      clearInterval(carouselInterval);
    });

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
    <p>Talla: ${product.textotalla}</p>
    <p><strong>$${product.price}</strong></p>
    <button class="add-btn">Agregar al carrito</button>
  `;

  const addBtn = info.querySelector(".add-btn");
  addBtn.addEventListener("click", () => {
    const selectedImage = product.images[currentIndex];
    const item = {
      ...product,
      selectedImage,
      quantity: 1
    };
    addToCart(item);
    showCartNotif();
  });

  card.appendChild(carousel);
  card.appendChild(thumbs);
  card.appendChild(info);
  container.appendChild(card);
});

// ================== FILTROS Y BUSCADOR ==================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const categoryBtns = document.querySelectorAll(".category-btn");

  // Función de búsqueda
  function searchProducts() {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      if (title.includes(query)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Click en buscar
  if (searchBtn) {
    searchBtn.addEventListener("click", searchProducts);
  }

  // Enter en el input
  if (searchInput) {
    searchInput.addEventListener("keyup", e => {
      if (e.key === "Enter") searchProducts();
    });
  }

  // Filtro por categoría
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.category;
      document.querySelectorAll(".card").forEach(card => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});

// ================== NOTIFICACIÓN (modal flotante) ==================
function showCartNotif() {
  const notifBox = document.getElementById("cartNotifBox");
  if (!notifBox) return;

  notifBox.classList.add("show"); // Mostrar modal

  // Cerrar al hacer click en "Seguir comprando"
  const keepShopping = document.getElementById("keepShopping");
  if (keepShopping) {
    keepShopping.onclick = () => {
      notifBox.classList.remove("show");
    };
  }

  // Cerrar al hacer click fuera del contenido
  notifBox.addEventListener("click", (e) => {
    if (e.target.id === "cartNotifBox") {
      notifBox.classList.remove("show");
    }
  });
}

// ================== INICIALIZAR ==================
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  updateCartCount();

  const keepShopping = document.getElementById("keepShopping");
  if (keepShopping) {
    keepShopping.addEventListener("click", () => {
      document.getElementById("cartNotifBox").classList.remove("show");
    });
  }
});


