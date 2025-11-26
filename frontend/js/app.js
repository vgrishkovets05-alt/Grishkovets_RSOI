console.log("Frontend connected ✅");

document.addEventListener("DOMContentLoaded", () => {
    setupHeader();
    showHome(); // отображаем главную страницу
});

// ------------------ Константы ------------------
const API_URL = "http://localhost:5003/api";

// ------------------ Основная разметка ------------------
function setupHeader() {
    if (!document.querySelector("header")) {
        const header = document.createElement("header");
        header.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div id="navLinks" style="display:flex; gap:15px;">
                    <button onclick="showHome()">Главная</button>
                    <button onclick="showCatalog()">Каталог</button>
                    <button onclick="showReviews()">Отзывы</button>
                </div>
                <div id="userArea"></div>
            </div>
        `;
        document.body.prepend(header);
    }
    if (!document.querySelector("#mainContent")) {
        const main = document.createElement("div");
        main.id = "mainContent";
        main.className = "container";
        document.body.appendChild(main);
    }
    renderUserArea();
}

// ------------------ Основные страницы ------------------
function showHome() {
    const main = getMainContent();
    main.innerHTML = `
        <h2>Добро пожаловать в Handmade Shop</h2>
        <p>Магазин изделий ручной работы</p>
        <button onclick="showCatalog()">Перейти в каталог</button>
    `;
}

function showCatalog() {
    const main = getMainContent();
    main.innerHTML = `
        <h2>Каталог товаров</h2>
        <div id="products" style="margin-top:20px;"></div>
    `;
    loadProducts();
}

function showReviews() {
    const main = getMainContent();
    main.innerHTML = `
        <h2>Отзывы</h2>
        <div id="reviews">Отзывы пока пустые</div>
    `;
}

function showLoginForm() {
    const main = getMainContent();
    main.innerHTML = `
        <h3>Вход</h3>
        <input type="email" id="loginEmail" placeholder="Email">
        <input type="password" id="loginPassword" placeholder="Пароль">
        <button onclick="login()">Войти</button>
        <div id="loginMessage"></div>
    `;
}

function showRegisterForm() {
    const main = getMainContent();
    main.innerHTML = `
        <h3>Регистрация</h3>
        <input type="text" id="regName" placeholder="Имя">
        <input type="email" id="regEmail" placeholder="Email">
        <input type="password" id="regPassword" placeholder="Пароль">
        <button onclick="register()">Зарегистрироваться</button>
        <div id="registerMessage"></div>
    `;
}

// ------------------ Вспомогательные функции ------------------
function getMainContent() {
    return document.getElementById("mainContent");
}

function getToken() {
    return localStorage.getItem("token");
}

function isLoggedIn() {
    return !!getToken();
}

function renderUserArea() {
    const area = document.getElementById("userArea");
    if (!area) return;

    const userName = localStorage.getItem("userName");
    if (userName) {
        area.innerHTML = `
            <span>${userName}</span>
            <button onclick="logout()">Выйти</button>
        `;
    } else {
        area.innerHTML = `
            <button onclick="showLoginForm()">Вход</button>
            <button onclick="showRegisterForm()">Регистрация</button>
        `;
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    renderUserArea();
    showHome();
}

// ------------------ Загрузка товаров ------------------
async function loadProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error("Ошибка загрузки продуктов");
        const products = await res.json();

        const productsDiv = document.getElementById("products");
        productsDiv.innerHTML = "";

        products.forEach(item => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${item.image || '1000042080.jpg'}" alt="${item.title}" class="product-image">
                <h4 class="product-title">${item.title}</h4>
                <p class="product-price">${item.price} BYN</p>
                <div style="display:flex; gap:8px; justify-content:center;">
                  <button class="add-to-cart" onclick="addToCart('${item._id}')">Добавить в корзину</button>
                  <button onclick="viewProduct('${item._id}')">Просмотр</button>
                </div>
            `;
            productsDiv.appendChild(card);
        });
    } catch (error) {
        alert("Ошибка загрузки товаров 😞");
        console.error(error);
    }
}

function viewProduct(id) {
    alert("Открыть карточку товара: " + id);
}

// ------------------ Корзина ------------------
async function addToCart(productId, quantity = 1) {
    try {
        const token = getToken();
        if (!token) { alert("Нужно войти, чтобы добавить товар"); return; }

        const res = await fetch(`${API_URL}/cart/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ productId, quantity })
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.message || "Ошибка добавления в корзину");
            return;
        }

        const cart = await res.json();
        alert("Товар добавлен в корзину");
        renderCartData(cart);
    } catch (err) {
        console.error(err);
        alert("Ошибка при добавлении в корзину");
    }
}

async function loadCart() {
    try {
        const token = getToken();
        if (!token) { alert("Нужно войти, чтобы посмотреть корзину"); return; }

        const res = await fetch(`${API_URL}/cart`, {
            headers: { "Authorization": "Bearer " + token }
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.message || "Ошибка при загрузке корзины");
            return;
        }

        const cart = await res.json();
        renderCartData(cart);
    } catch (err) {
        console.error(err);
        alert("Ошибка при загрузке корзины");
    }
}

function renderCartData(cart) {
    const main = getMainContent();
    main.innerHTML += `<h2>Корзина</h2>`;

    if (!cart || !cart.items || cart.items.length === 0) {
        main.innerHTML += `<p>В корзине пока пусто.</p>`;
        return;
    }

    let html = `<table style="width:100%; border-collapse: collapse;">`;
    html += `<tr style="text-align:left; border-bottom:1px solid #d2b48c;">
                <th>Товар</th><th>Цена</th><th>Кол-во</th><th>Сумма</th><th></th>
             </tr>`;

    let total = 0;
    cart.items.forEach(i => {
        const prod = i.product;
        const line = i.quantity * i.price;
        total += line;

        html += `
            <tr style="border-bottom:1px solid #f0e6db;">
                <td style="padding:8px;">
                  <div style="display:flex; gap:10px; align-items:center;">
                    <img src="${prod.image || '1000042080.jpg'}" style="width:60px; height:60px; object-fit:cover; border-radius:6px;">
                    <div>
                      <div style="font-weight:bold;">${prod.title}</div>
                    </div>
                  </div>
                </td>
                <td style="padding:8px;">${i.price} BYN</td>
                <td style="padding:8px;">
                  <button onclick="changeQuantity('${prod._id}', ${i.quantity - 1})">−</button>
                  <span style="padding:0 8px;">${i.quantity}</span>
                  <button onclick="changeQuantity('${prod._id}', ${i.quantity + 1})">+</button>
                </td>
                <td style="padding:8px;">${line} BYN</td>
                <td style="padding:8px;"><button onclick="removeFromCart('${prod._id}')">Удалить</button></td>
            </tr>
        `;
    });

    html += `<tr><td colspan="3" style="text-align:right; padding:10px; font-weight:bold;">Итого:</td>
             <td style="padding:10px; font-weight:bold;">${total} BYN</td><td></td></tr>`;
    html += `</table>`;

    main.innerHTML += html;
}

// ------------------ Корзина: изменение и удаление ------------------
async function changeQuantity(productId, newQty) {
    try {
        const token = getToken();
        if (!token) { alert("Нужно войти"); return; }

        const res = await fetch(`${API_URL}/cart/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ productId, quantity: newQty })
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.message || "Ошибка обновления");
            return;
        }

        const cart = await res.json();
        renderCartData(cart);
    } catch (err) {
        console.error(err);
        alert("Ошибка изменения количества");
    }
}

async function removeFromCart(productId) {
    try {
        const token = getToken();
        if (!token) { alert("Нужно войти"); return; }

        const res = await fetch(`${API_URL}/cart/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ productId })
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.message || "Ошибка удаления");
            return;
        }

        const cart = await res.json();
        renderCartData(cart);
    } catch (err) {
        console.error(err);
        alert("Ошибка при удалении из корзины");
    }
}

// ------------------ Регистрация ------------------
async function register() {
    const name = document.getElementById("regName")?.value;
    const email = document.getElementById("regEmail")?.value;
    const password = document.getElementById("regPassword")?.value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        alert(data.message || "Зарегистрировано");
        showLoginForm();
    } catch (error) {
        console.error(error);
        alert("Ошибка регистрации");
    }
}

// ------------------ Вход ------------------
async function login() {
    const email = document.getElementById("loginEmail")?.value;
    const password = document.getElementById("loginPassword")?.value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.user?.name || "Пользователь");
            renderUserArea();
            alert("Успешный вход");
            showCatalog(); // сразу переходим в каталог после входа
        } else {
            alert(data.message || "Ошибка входа");
        }
    } catch (error) {
        console.error(error);
        alert("Ошибка входа");
    }
}
