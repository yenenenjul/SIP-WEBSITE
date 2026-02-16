document.addEventListener("DOMContentLoaded", () => {

    let currentUser = null;
    let cart = [];
    let total = 0;

    const loginBtn = document.getElementById("loginBtn");
    const cartCount = document.querySelector(".cart-count");
    const totalSpan = document.getElementById("total");
    const studentName = document.getElementById("studentName");

    // LOGIN
    const loginBtn = document.getElementById("loginBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");

loginBtn.addEventListener("click", () => {
    const u = username.value.trim();
    const p = password.value.trim();

    if (u === "admin" && p === "admin123") {
        location.href = "admin.html";
        return;
    }

    if (u && p) {
        currentUser = u;
        studentName.textContent = "Hi, " + u;

        Login.style.display = "none";
        Menu.style.display = "block";
    } else {
        alert("Enter username & password");
    }
});
    // ADD TO CART
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            if (!currentUser) return alert("Login first");

            const qty = parseInt(btn.previousElementSibling.value);
            const price = parseInt(btn.dataset.price);

            cart.push({
                item: btn.dataset.item,
                qty,
                price
            });

            saveCart();
            updateCart();
        });
    });

    // OPEN CART
    document.querySelector(".cart").addEventListener("click", openCart);

    function openCart() {
        const list = document.getElementById("orderList");
        list.innerHTML = "";

        cart.forEach((c, i) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${c.item} (x${c.qty}) - ₱${c.qty * c.price}
                <button onclick="removeItem(${i})">❌</button>
            `;
            list.appendChild(li);
        });

        orderModal.style.display = "flex";
    }

    window.removeItem = (index) => {
        cart.splice(index, 1);
        saveCart();
        updateCart();
        openCart();
    };

    // PLACE ORDER
    placeOrder.addEventListener("click", () => {
        if (!cart.length) return alert("Cart empty");

        const orderNumber = Math.floor(Math.random() * 9000) + 1000; // SHORT #

        const order = {
            orderNumber,
            student: currentUser,
            cart,
            total,
            status: "PENDING"
        };

        localStorage.setItem("order_" + orderNumber, JSON.stringify(order));

        alert("Order placed! #" + orderNumber);

        cart = [];
        saveCart();
        updateCart();
    });

    // CANCEL ORDER
    cancelOrder.addEventListener("click", () => {
        cart = [];
        saveCart();
        updateCart();
        alert("Order cancelled");
    });

    function updateCart() {
        total = cart.reduce((sum, c) => sum + c.qty * c.price, 0);
        totalSpan.textContent = total;
        cartCount.textContent = cart.length;
    }

    function saveCart() {
        localStorage.setItem("cart_" + currentUser, JSON.stringify(cart));
    }

    // CATEGORY FILTER
    document.querySelectorAll(".categories button").forEach(btn => {
        btn.addEventListener("click", () => {
            const cat = btn.dataset.category;

            document.querySelectorAll(".item").forEach(item => {
                item.style.display =
                    cat === "all" || item.dataset.category === cat
                        ? "block"
                        : "none";
            });
        });
    });

    // READY NOTIFICATION
    setInterval(() => {
        if (!currentUser) return;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key.startsWith("order_")) continue;

            const order = JSON.parse(localStorage.getItem(key));

            if (order.student === currentUser && order.status === "READY") {
                alert(Order #${order.orderNumber} is READY for pickup!);
                localStorage.removeItem(key);
            }
        }
    }, 4000);
});

function closeModal() {
    orderModal.style.display = "none";
}

