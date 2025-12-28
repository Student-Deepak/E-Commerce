console.log("app.js loaded");


let cart = JSON.parse(localStorage.getItem("cart")) || [];

const heroContainer = document.querySelector(".hero-container");
const cartHead = document.querySelector("#cart-head");
const totalPayment = document.querySelector(".total-payment");
const paymentBtn = document.querySelector(".cart-payment"); 

/* ================= ADD TO CART ================= */
document.addEventListener("click", function (e) {
    if (!e.target.classList.contains("cart-btn")) return;

    const card = e.target.closest(".card");
    if (!card) return;

    const image = card.querySelector("img").getAttribute("src");

    const priceText = card.querySelector(".price").innerText.split("\n");
    const name = priceText[0].trim();
    const price = Number(priceText[1].replace("Rs.", "").trim());

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name,
            price,
            image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
});

/* ================= RENDER CART ================= */
function renderCart() {
    if (!heroContainer) return;

    heroContainer.innerHTML = "";

    if (cart.length === 0) {
        cartHead.textContent = "Your Cart is Empty";
        totalPayment.textContent = 0;
        controlPaymentButton(); // ✅
        return;
    }

    cartHead.textContent = "Your Bag";

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item-card";

        div.innerHTML = `
            <div class="product-image">
                <img src="${item.image}">
            </div>
            <div class="product-detail">
                <p><b>${item.name}</b></p>
                <p><strong>Rs ${item.price * item.quantity}</strong></p>
                <p>Quantity : ${item.quantity}</p>
            </div>
            <div class="operations">
                <button class="cart-rm-one" data-index="${index}">-</button>
                <button class="cart-add-one" data-index="${index}">+</button>
            </div>
        `;
        heroContainer.appendChild(div);
    });

    updateTotal();
}

/* ================= PLUS / MINUS ================= */
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("cart-add-one")) {
        cart[e.target.dataset.index].quantity++;
    }

    if (e.target.classList.contains("cart-rm-one")) {
        cart[e.target.dataset.index].quantity--;
        if (cart[e.target.dataset.index].quantity === 0) {
            cart.splice(e.target.dataset.index, 1);
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
});

/* ================= TOTAL ================= */
function updateTotal() {
    const total = getTotalAmount();
    totalPayment.textContent = "Total :  Rs " + total;
    controlPaymentButton(); // ✅
}

/* ================= HELPERS ================= */
function getTotalAmount() {
    let total = 0;
    cart.forEach(item => total += item.price * item.quantity);
    return total;
}

function controlPaymentButton() {
    if (!paymentBtn) return;

    if (cart.length === 0 || getTotalAmount() === 0) {
        paymentBtn.disabled = true;
        paymentBtn.style.opacity = "0.5";
        paymentBtn.style.cursor = "not-allowed";
    } else {
        paymentBtn.disabled = false;
        paymentBtn.style.opacity = "1";
        paymentBtn.style.cursor = "pointer";
    }
}

/* ================= EXTRA SAFETY ================= */
if (paymentBtn) {
    paymentBtn.addEventListener("click", function (e) {
        if (getTotalAmount() === 0) {
            e.preventDefault();
            alert("Your cart is empty");
        }
    });
}

/* ================= REDIRECT TO HOME ================= */
document.addEventListener("click", function (e) {
    const addItemsBtn = e.target.closest("#cart-add-items");
    if (!addItemsBtn) return;

    window.location.href = "index.html";
});


/* ================= INITIAL LOAD ================= */
renderCart(); 