/* =============================================
   RUHE COFFEE — script.js
   ============================================= */

// ── Menu Data ──────────────────────────────────
const menuItems = [
  {
    id: 1,
    name: "Ruhe Signature Blend",
    desc: "Espresso pilihan kami dengan perpaduan fruity & nutty yang harmonis.",
    price: 28000,
    img: "img/menu.png",
  },
  {
    id: 2,
    name: "Caramel Macchiato",
    desc: "Espresso lembut dengan susu segar dan siraman karamel manis.",
    price: 32000,
    img: "img/menu.png",
  },
  {
    id: 3,
    name: "Matcha Latte",
    desc: "Matcha premium Jepang dipadukan susu oat yang creamy.",
    price: 30000,
    img: "img/menu.png",
  },
  {
    id: 4,
    name: "V60 Pour Over",
    desc: "Metode manual brew V60 dengan biji single origin pilihan.",
    price: 35000,
    img: "img/menu.png",
  },
  {
    id: 5,
    name: "Cold Brew",
    desc: "Diseduh dingin selama 18 jam untuk rasa yang halus dan segar.",
    price: 33000,
    img: "img/menu.png",
  },
  {
    id: 6,
    name: "Chocolate Hazelnut",
    desc: "Coklat belgia dengan sentuhan hazelnut dan susu full cream.",
    price: 29000,
    img: "img/menu.png",
  },
];

// ── Cart State ─────────────────────────────────
let cart = {}; // { id: { ...menuItem, qty } }

// ── Helpers ────────────────────────────────────
const formatRupiah = (num) =>
  "Rp " + num.toLocaleString("id-ID");

// ── Render Menu ────────────────────────────────
function renderMenu() {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = menuItems
    .map(
      (item) => `
    <div class="menu-card">
      <div class="menu-card-body">
        <div class="menu-card-name">${item.name}</div>
        <div class="menu-card-desc">${item.desc}</div>
        <div class="menu-card-footer">
          <span class="menu-card-price">${formatRupiah(item.price)}</span>
          <button class="btn-add" onclick="addToCart(${item.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Tambah
          </button>
        </div>
      </div>
    </div>`
    )
    .join("");
}

// ── Cart Logic ─────────────────────────────────
function addToCart(id) {
  const item = menuItems.find((m) => m.id === id);
  if (!item) return;

  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = { ...item, qty: 1 };
  }

  renderCart();
  openCart();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  renderCart();
}

function clearCart() {
  cart = {};
  renderCart();
}

function renderCart() {
  const body = document.getElementById("cartBody");
  const footer = document.getElementById("cartFooter");
  const badge = document.getElementById("cartBadge");
  const totalEl = document.getElementById("cartTotal");

  const ids = Object.keys(cart);

  // Badge
  const totalQty = ids.reduce((s, id) => s + cart[id].qty, 0);
  badge.textContent = totalQty;

  if (ids.length === 0) {
    body.innerHTML = '<p class="cart-empty">Keranjang masih kosong.</p>';
    footer.style.display = "none";
    return;
  }

  footer.style.display = "flex";

  // Items
  body.innerHTML = ids
    .map(
      (id) => {
        const item = cart[id];
        return `
        <div class="cart-item">
          <div style="flex:1">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatRupiah(item.price)} × ${item.qty} = ${formatRupiah(item.price * item.qty)}</div>
          </div>
          <div class="cart-qty">
            <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${id}, +1)">+</button>
          </div>
        </div>`;
      }
    )
    .join("");

  // Total
  const total = ids.reduce((s, id) => s + cart[id].price * cart[id].qty, 0);
  totalEl.textContent = formatRupiah(total);
}

// ── Checkout ───────────────────────────────────
function checkout() {
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  const total = ids.reduce((s, id) => s + cart[id].price * cart[id].qty, 0);

  let lines = ids.map(
    (id) =>
      `• ${cart[id].name} x${cart[id].qty} = ${formatRupiah(cart[id].price * cart[id].qty)}`
  );

  const message =
    `Halo Ruhe Coffee! 👋\n\nSaya ingin memesan:\n\n` +
    lines.join("\n") +
    `\n\n*Total: ${formatRupiah(total)}*\n\nMohon konfirmasi pesanan saya. Terima kasih! 🙏`;

  const encoded = encodeURIComponent(message);
  const phone = "6285168659770";
  window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
}

// ── Sidebar Open/Close ─────────────────────────
function openCart() {
  document.getElementById("cartSidebar").classList.add("active");
  document.getElementById("cartOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("active");
  document.getElementById("cartOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

// ── Event Listeners ────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderCart();

  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document.getElementById("btnClear").addEventListener("click", clearCart);
  document.getElementById("btnCheckout").addEventListener("click", checkout);
});
