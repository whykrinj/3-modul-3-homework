let data = null;
let loading = false;
let cart = [];

const loadingElement = document.querySelector("#loading");
const productsListElement = document.querySelector("#products-list");
const cartSectionElement = document.querySelector("#cart-section");
const totalAmountElement = document.querySelector("#total-amount");

function toggleLoading() {
    if (loading) {
        loadingElement.classList.remove('hidden');
        productsListElement.classList.add('hidden');
    } else {
        loadingElement.classList.add('hidden');
        productsListElement.classList.remove('hidden');
    }
}

async function fetchProducts() {
    loading = true;
    toggleLoading();
    try {
        const response = await fetch('https://fakestoreapi.com/products?limit=30');
        data = await response.json();
        console.log(data);
        displayProducts(data);
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        loading = false;
        toggleLoading();
    }
}

function displayProducts(products) {
    productsListElement.innerHTML = "";
    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.className = "min-w-[260px] max-w-[280px] rounded-lg overflow-hidden flex-1 bg-white shadow-xl text-black p-4"; 
        productElement.innerHTML = `
        <figure class="w-full h-[270px] overflow-hidden mb-4">
            <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover p-2" onerror="this.src='https://via.placeholder.com/150';"/>
        </figure>
        <div class="card-body">
            <h2 class="card-title text-lg font-bold">${product.title}</h2>
            <p class="text-green-500 inline">Price: $${product.price.toFixed(2)}</p> 
            <button class="bg-blue-500 text-white py-1 px-4 rounded ml-4" onclick="addToCart('${product.id}', ${product.price})">Buy</button>
        </div>
        `;
        productsListElement.appendChild(productElement);
    });
}

function addToCart(productId, productPrice) {
    const product = data.find(item => item.id === Number(productId));
    if (product) {
        cart.push({ ...product, price: productPrice }); 
        alert(`${product.title} has been added to the cart!`);
        updateCart();
    }
}

function updateCart() {
    let total = 0;
    cart.forEach(item => {
        total += item.price;
    });

    totalAmountElement.innerHTML = `Total: $${total.toFixed(2)}`;

    cartSectionElement.innerHTML = ''; 
    if (cart.length === 0) {
        cartSectionElement.innerHTML = '<p>Your cart is empty!</p>';
    } else {
        cart.forEach(item => {
            cartSectionElement.innerHTML += `
            <div class="flex justify-between mb-4">
                <p>${item.title} - $${item.price.toFixed(2)}</p>
            </div>`;
        });
    }
}

fetchProducts();
