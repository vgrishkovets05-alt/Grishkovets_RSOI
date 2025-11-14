console.log("Frontend connected ✅");

document.addEventListener("DOMContentLoaded", () => {
    if (!document.querySelector(".container")) { // если контейнера ещё нет
        const container = document.createElement("div");
        container.className = "container";
        container.innerHTML = `
            <h2>Каталог товаров</h2>
            <button onclick="loadProducts()">Загрузить товары</button>
            <div id="products"></div>

            <hr>

            <h3>Регистрация</h3>
            <input type="text" id="regName" placeholder="Имя">
            <input type="email" id="regEmail" placeholder="Email">
            <input type="password" id="regPassword" placeholder="Пароль">
            <button onclick="register()">Зарегистрироваться</button>
            <div id="registerMessage"></div>

            <hr>

            <h3>Вход</h3>
            <input type="email" id="loginEmail" placeholder="Email">
            <input type="password" id="loginPassword" placeholder="Пароль">
            <button onclick="login()">Войти</button>
            <div id="loginMessage"></div>
        `;
        document.body.appendChild(container);
    }
});


const API_URL = "http://localhost:5003/api";

async function loadProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();

        const productsDiv = document.getElementById("products");
        productsDiv.innerHTML = "";

        data.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = `<p><b>${item.name}</b> — ${item.price} BYN</p>`;
            productsDiv.appendChild(div);
        });
    } catch (error) {
        alert("Ошибка загрузки товаров 😞 (backend ещё не готов)");
        console.error(error);
    }
}

// Регистрация пользователя
async function register() {
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        document.getElementById("registerMessage").innerText = data.message;
    } catch (error) {
        console.error(error);
        document.getElementById("registerMessage").innerText = "Ошибка регистрации";
    }
}

// Вход пользователя
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        document.getElementById("loginMessage").innerText = data.message;

        if (data.token) {
            // Сохраняем токен в localStorage для дальнейших запросов
            localStorage.setItem("token", data.token);
            console.log("JWT Token:", data.token);
        }
    } catch (error) {
        console.error(error);
        document.getElementById("loginMessage").innerText = "Ошибка входа";
    }
}
