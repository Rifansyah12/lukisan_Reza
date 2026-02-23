// Data lukisan
const paintings = [
  {
    id: 1,
    title: "Malam Berbintang",
    artist: "Vincent van Gogh",
    year: "1889",
    price: "Rp 850.000.000",
    description:
      "Lukisan ikonik yang menggambarkan pemandangan malam dari jendela kamar Van Gogh di rumah sakit jiwa Saint-Rémy. Karya ini terkenal dengan sapuan kuas bergelombang dan warna biru yang intens.",
    size: "73.7 cm × 92.1 cm",
    medium: "Minyak di atas kanvas",
  },
  {
    id: 2,
    title: "Wanita dengan Misteri",
    artist: "Leonardo da Vinci",
    year: "1503-1506",
    price: "Rp 1.250.000.000",
    description:
      "Potret setengah badan Lisa Gherardini, istri seorang pedagang sutra Florentine. Lukisan ini terkenal dengan senyuman misterius dan teknik sfumato yang sempurna.",
    size: "77 cm × 53 cm",
    medium: "Minyak di atas panel kayu poplar",
  },
  {
    id: 3,
    title: "Ingatan yang Abadi",
    artist: "Salvador Dali",
    year: "1931",
    price: "Rp 980.000.000",
    description:
      "Karya surrealis yang menggambarkan jam-jam yang meleleh di lanskap mimpi. Lukisan ini menjadi simbol gerakan surrealisme.",
    size: "24 cm × 33 cm",
    medium: "Minyak di atas kanvas",
  },
];

// Cart functionality
let cart = [];
let cartCount = 0;

// DOM Ready
document.addEventListener("DOMContentLoaded", function () {
  initScrollAnimations();
  initNavbarScroll();
  initCart();
  initModal();
  initBackToTop();
  initFormSubmit();
  initScrollReveal();

  // Floating elements animation
  animateFloatingElements();
});

// Scroll Animations
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right",
  );

  const revealOnScroll = () => {
    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        const delay = element.getAttribute("data-delay") || 0;
        setTimeout(() => {
          element.classList.add("active");
        }, delay * 1000);
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Initial check
}

// Navbar scroll effect
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// Cart functionality
function initCart() {
  const cartBtn = document.querySelector(".cart-btn");
  const closeCartBtn = document.querySelector(".btn-close-cart");
  const cartOverlay = document.querySelector(".cart-overlay");
  const cartSidebar = document.querySelector(".cart-sidebar");

  // Open cart
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Close cart
  closeCartBtn.addEventListener("click", () => {
    closeCart();
  });

  cartOverlay.addEventListener("click", () => {
    closeCart();
  });

  // Add to cart buttons
  document.querySelectorAll(".btn-add-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const paintingId = parseInt(e.target.getAttribute("data-id"));
      addToCart(paintingId);

      // Animation feedback
      e.target.textContent = "✓ Ditambahkan";
      e.target.style.backgroundColor = "#28a745";

      setTimeout(() => {
        e.target.textContent = "+ Keranjang";
        e.target.style.backgroundColor = "";
      }, 1500);
    });
  });
}

function closeCart() {
  document.querySelector(".cart-sidebar").classList.remove("active");
  document.querySelector(".cart-overlay").classList.remove("active");
  document.body.style.overflow = "auto";
}

function addToCart(paintingId) {
  const painting = paintings.find((p) => p.id === paintingId);

  if (painting) {
    // Check if already in cart
    const existingItem = cart.find((item) => item.id === paintingId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...painting,
        quantity: 1,
      });
    }

    cartCount++;
    updateCartDisplay();
  }
}

function updateCartDisplay() {
  const cartCountEl = document.querySelector(".cart-count");
  const cartItemsEl = document.querySelector(".cart-items");
  const totalPriceEl = document.querySelector(".total-price");

  // Update cart count
  cartCountEl.textContent = cartCount;

  // Update cart items
  cartItemsEl.innerHTML = "";

  let totalPrice = 0;

  cart.forEach((item) => {
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""));
    const itemTotal = priceNum * item.quantity;
    totalPrice += itemTotal;

    const cartItemEl = document.createElement("div");
    cartItemEl.className = "cart-item";
    cartItemEl.innerHTML = `
            <div class="cart-item-img">
                <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="${item.title}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.price} × ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
                <i class="fas fa-times"></i>
            </button>
        `;

    cartItemsEl.appendChild(cartItemEl);

    // Add remove event
    cartItemEl
      .querySelector(".cart-item-remove")
      .addEventListener("click", (e) => {
        const id = parseInt(
          e.target.closest(".cart-item-remove").getAttribute("data-id"),
        );
        removeFromCart(id);
      });
  });

  // Update total price
  totalPriceEl.textContent = `Rp ${totalPrice.toLocaleString("id-ID")}`;

  // If cart is empty
  if (cart.length === 0) {
    cartItemsEl.innerHTML =
      '<p class="text-center text-muted">Keranjang kosong</p>';
  }
}

function removeFromCart(paintingId) {
  const itemIndex = cart.findIndex((item) => item.id === paintingId);

  if (itemIndex !== -1) {
    cartCount -= cart[itemIndex].quantity;
    cart.splice(itemIndex, 1);
    updateCartDisplay();
  }
}

// Modal functionality
function initModal() {
  const modalButtons = document.querySelectorAll(".btn-view");
  const modalContent = document.getElementById("modalContent");

  modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const paintingId = parseInt(button.getAttribute("data-painting"));
      const painting = paintings.find((p) => p.id === paintingId);

      if (painting) {
        modalContent.innerHTML = `
                    <div class="row">
                        <div class="col-md-6">
                            <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                 alt="${painting.title}" class="img-fluid rounded mb-3">
                        </div>
                        <div class="col-md-6">
                            <h3>${painting.title}</h3>
                            <p class="text-muted">${painting.artist}, ${painting.year}</p>
                            <p>${painting.description}</p>
                            <ul class="list-unstyled">
                                <li><strong>Ukuran:</strong> ${painting.size}</li>
                                <li><strong>Media:</strong> ${painting.medium}</li>
                                <li><strong>Harga:</strong> <span class="text-primary fw-bold">${painting.price}</span></li>
                            </ul>
                            <button class="btn btn-primary btn-lg w-100 mt-3 btn-add-cart-modal" data-id="${painting.id}">
                                <i class="fas fa-shopping-cart"></i> Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                `;

        // Add event to modal add to cart button
        setTimeout(() => {
          document
            .querySelector(".btn-add-cart-modal")
            ?.addEventListener("click", () => {
              addToCart(painting.id);
              const modal = bootstrap.Modal.getInstance(
                document.getElementById("paintingModal"),
              );
              modal.hide();

              // Show notification
              showNotification(`${painting.title} ditambahkan ke keranjang!`);
            });
        }, 100);
      }
    });
  });
}

// Back to top button
function initBackToTop() {
  const backToTopBtn = document.querySelector(".btn-back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("active");
    } else {
      backToTopBtn.classList.remove("active");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Form submission
function initFormSubmit() {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const formData = new FormData(contactForm);
    const name = formData.get("name") || "Pengguna";

    // Show success message
    showNotification(`Terima kasih ${name}! Pesan Anda telah dikirim.`);

    // Reset form
    contactForm.reset();
  });
}

// Floating elements animation
function animateFloatingElements() {
  const floatingElements = document.querySelectorAll(".floating");

  floatingElements.forEach((el, index) => {
    // Randomize animation
    const duration = 6 + Math.random() * 4;
    const delay = index * 2;

    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
  });
}

// Scroll reveal initialization
function initScrollReveal() {
  // Initialize scroll animations
  const scrollReveal = () => {
    const elements = document.querySelectorAll(
      ".reveal-up, .reveal-left, .reveal-right",
    );

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        const delay = element.getAttribute("data-delay") || 0;

        setTimeout(() => {
          element.classList.add("active");
        }, delay * 1000);
      }
    });
  };

  window.addEventListener("scroll", scrollReveal);
  scrollReveal(); // Initial check
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        transform: translateX(150%);
        transition: transform 0.5s ease;
        max-width: 350px;
    `;

  notification.querySelector(".notification-content").style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Hide and remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(150%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}

// Parallax effect on hero
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");

  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Mouse move effect
document.addEventListener("mousemove", (e) => {
  const floatingElements = document.querySelectorAll(".floating");

  floatingElements.forEach((el) => {
    const speed = el.getAttribute("data-speed") || 0.02;
    const x = (window.innerWidth - e.pageX * speed) / 100;
    const y = (window.innerHeight - e.pageY * speed) / 100;

    el.style.transform = `translateX(${x}px) translateY(${y}px)`;
  });
});

// WhatsApp functionality
function initWhatsApp() {
  const whatsappBtn = document.querySelector(".whatsapp-btn");
  const chatWidget = document.createElement("div");

  // Create chat widget HTML
  chatWidget.className = "whatsapp-chat-widget";
  chatWidget.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-info">
                <div class="chat-avatar">
                    <i class="fab fa-whatsapp"></i>
                </div>
                <div>
                    <h6>Galeri Retro</h6>
                    <small>Online</small>
                </div>
            </div>
            <button class="chat-close">&times;</button>
        </div>
        <div class="chat-body">
            <div class="chat-message incoming">
                <p>Halo! Selamat datang di Galeri Retro. Ada yang bisa saya bantu?</p>
                <small>Baru saja</small>
            </div>
        </div>
        <div class="chat-input">
            <input type="text" placeholder="Ketik pesan..." readonly 
                   onclick="window.open('https://wa.me/6289653131323?text=Halo%20Galeri%20Retro,%20saya%20tertarik%20dengan%20koleksi%20lukisan%20Anda', '_blank')">
        </div>
    `;

  document.body.appendChild(chatWidget);

  // Toggle chat widget
  whatsappBtn.addEventListener("click", function (e) {
    if (!chatWidget.classList.contains("active")) {
      // If just showing tooltip, don't toggle chat
      if (window.innerWidth > 768) {
        e.preventDefault();
        chatWidget.classList.add("active");
      }
    }
  });

  // Close chat widget
  chatWidget
    .querySelector(".chat-close")
    .addEventListener("click", function () {
      chatWidget.classList.remove("active");
    });

  // Close chat when clicking outside
  document.addEventListener("click", function (e) {
    if (!chatWidget.contains(e.target) && !whatsappBtn.contains(e.target)) {
      chatWidget.classList.remove("active");
    }
  });

  // Auto close chat widget after 30 seconds
  setInterval(() => {
    chatWidget.classList.remove("active");
  }, 30000);
}

// Initialize WhatsApp when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // ... kode lainnya ...
  initWhatsApp();
  // ... kode lainnya ...
});
