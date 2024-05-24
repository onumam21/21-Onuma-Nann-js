document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('button').addEventListener('click', validateAndSubmit);
    document.getElementById('cancelOrder').addEventListener('click', () => {
        document.getElementById('orderList').innerHTML = '';
        updateTotalPrice();
    });
    document.getElementById('orderNow').addEventListener('click', handleOrderNow);
});

async function validateAndSubmit() {
    const price = document.getElementById('price').value;
    const imageUrl = document.getElementById('imageUrl').value;
    const errorMessage = document.getElementById('error-message');

    const isValidImage = await validateImageURL(imageUrl);
    if (isNaN(price) || !isValidImage) {
        errorMessage.classList.remove('hidden');
    } else {
        errorMessage.classList.add('hidden');
        addProduct();
    }
}

function validateImageURL(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

function addProduct() {
    const productName = document.getElementById('fname').value;
    const productPrice = document.getElementById('price').value;
    const imageUrl = document.getElementById('imageUrl').value;

    const product = {
        name: productName,
        price: parseFloat(productPrice).toFixed(2),
        imageUrl: imageUrl
    };

    renderProduct(product);

    document.getElementById('fname').value = '';
    document.getElementById('price').value = '';
    document.getElementById('imageUrl').value = '';
}

function renderProduct(product) {
    const productList = document.getElementById('productList');

    const productCard = document.createElement('div');
    productCard.className = 'bg-white shadow rounded p-4 flex items-center';

    const productImage = document.createElement('img');
    productImage.src = product.imageUrl;
    productImage.alt = product.name;
    productImage.className = 'w-16 h-16 object-cover mr-4';

    const productDetails = document.createElement('div');
    productDetails.className = 'flex-grow';

    const productTitle = document.createElement('h3');
    productTitle.className = 'text-xl font-bold mb-2';
    productTitle.textContent = product.name;

    const productPriceTag = document.createElement('p');
    productPriceTag.className = 'text-gray-700';
    productPriceTag.textContent = `Price: ฿${product.price}`;

    let productCheckbox = document.createElement('input');
    productCheckbox.type = 'checkbox';
    productCheckbox.className = 'ml-2';
    productCheckbox.addEventListener('click', () => {
        if (productCheckbox.checked) {
            addAddToCartButton(productCard, product);
        } else {
            removeAddToCartButton(productCard);
        }
    });

    productDetails.appendChild(productTitle);
    productDetails.appendChild(productPriceTag);
    productDetails.appendChild(productCheckbox);

    productCard.appendChild(productImage);
    productCard.appendChild(productDetails);

    productList.appendChild(productCard);
}

function addAddToCartButton(productCard, product) {
    if (!productCard.querySelector('.add-to-cart-btn')) {
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.className = 'add-to-cart-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-4';
        addToCartButton.addEventListener('click', () => {
            addToOrderSection(product);
            productCard.removeChild(addToCartButton);
        });
        productCard.appendChild(addToCartButton);
    }
}

function addToOrderSection(product) {
    const orderList = document.getElementById('orderList');

    const orderItem = document.createElement('div');
    orderItem.className = 'flex items-center space-x-4';

    const orderImage = document.createElement('img');
    orderImage.src = product.imageUrl;
    orderImage.alt = product.name;
    orderImage.className = 'w-16 h-16 object-cover';

    const orderDetails = document.createElement('div');
    orderDetails.className = 'flex-grow';

    const orderTitle = document.createElement('h3');
    orderTitle.className = 'text-xl font-bold';
    orderTitle.textContent = product.name;

    const orderPrice = document.createElement('p');
    orderPrice.className = 'text-gray-700';
    orderPrice.textContent = `Price: ฿${product.price}`;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = 1;
    quantityInput.min = 1;
    quantityInput.className = 'w-16 p-1 border rounded';
    quantityInput.addEventListener('input', () => updateTotalPrice());

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded';
    removeButton.addEventListener('click', () => {
        orderList.removeChild(orderItem);
        updateTotalPrice();
    });

    orderDetails.appendChild(orderTitle);
    orderDetails.appendChild(orderPrice);

    orderItem.appendChild(orderImage);
    orderItem.appendChild(orderDetails);
    orderItem.appendChild(quantityInput);
    orderItem.appendChild(removeButton);

    orderList.appendChild(orderItem);

    updateTotalPrice();
}

function updateTotalPrice() {
    const orderItems = document.querySelectorAll('#orderList > div');
    let totalPrice = 0;

    orderItems.forEach(item => {
        const priceText = item.querySelector('p').textContent;
        const price = parseFloat(priceText.replace('Price: ฿', ''));
        const quantity = parseInt(item.querySelector('input').value);
        totalPrice += price * quantity;
    });

    const formattedTotalPrice = `฿${totalPrice.toFixed(2)}`;
    document.getElementById('totalPrice').textContent = `Total Price: ${formattedTotalPrice}`;
}

function handleOrderNow() {
    const orderNow = document.getElementById('orderNow');
    const orderItems = orderNow.querySelectorAll('div');
    const orders = [];

    orderItems.forEach(item => {
        const productName = item.querySelector('h3').textContent;
        const productPrice = parseFloat(item.querySelector('p').textContent.replace('Price: ฿', ''));
        const quantity = parseInt(item.querySelector('input').value);

        orders.push({ name: productName, price: productPrice, quantity: quantity });
    });

    console.log('Order Details:', orders);
    alert('Order placed successfully!');
    orderList.innerHTML = '';
    updateTotalPrice();
}
