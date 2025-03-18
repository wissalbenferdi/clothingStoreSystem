function scrollToCart() {
    const cartSection = document.getElementById('cart');
    if (cartSection) {
      cartSection.scrollIntoView({ behavior: 'smooth' });
    }
  }


let cart = [];

document.querySelectorAll('.fa-shopping-cart').forEach(button => {
    button.addEventListener('click', addToCart);
});

function addToCart(event) {
    event.preventDefault();
    const productBox = event.target.closest('.box');
    const product = {
        name: productBox.querySelector('h3').textContent,
        price: parseFloat(productBox.querySelector('.price').textContent.match(/\d+\.\d+/)[0]),
        image: productBox.querySelector('img').src
    };

    const existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    updateCartDisplay();
}

function updateCartDisplay() {
    const cartBody = document.querySelector('#cart tbody');
    const cartTotal = document.querySelector('#cart tfoot td:last-child');
    let total = 0;

    cartBody.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="adjustQuantity(${index}, -1)">-</button>
                    ${item.quantity}
                    <button class="quantity-btn" onclick="adjustQuantity(${index}, 1)">+</button>
                </div>
            </td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td><span class="remove-item" onclick="removeItem(${index})">✕</span></td>
        `;
        cartBody.appendChild(row);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function adjustQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    updateCartDisplay();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Checkout Form Handling
document.querySelector('#checkout form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const formData = new FormData(this);
    const order = {
        customer: Object.fromEntries(formData),
        items: cart,
        total: parseFloat(document.querySelector('#cart tfoot td:last-child').textContent.slice(1))
    };

    // Here you would typically send this data to a server
    console.log('Order submitted:', order);
    alert('Order placed successfully!');
    cart = [];
    updateCartDisplay();
    this.reset();
});



document.addEventListener("DOMContentLoaded", () => {
    const detailsButtons = document.querySelectorAll(".details-btn");
    const detailsSection = document.getElementById("product-details");
    const detailsImage = document.getElementById("details-image");
    const detailsTitle = document.getElementById("details-title");
    const detailsPrice = document.getElementById("details-price");
    const sizeSelect = document.getElementById("size-select");
    const colorSelect = document.getElementById("color-select");
    const addToCartBtn = document.getElementById("add-to-cart-btn");

    let currentProduct = null;

    // Show product details when "info circle" is clicked
    detailsButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            // Get product info from the clicked item's parent container
            const productBox = button.closest(".box");
            const productImage = productBox.querySelector(".image img").src;
            const productTitle = productBox.querySelector(".content h3").textContent;
            const productPrice = productBox.querySelector(".price").textContent.split('$')[1].trim();

            // Save current product info
            currentProduct = {
                name: productTitle,
                image: productImage,
                price: parseFloat(productPrice),
            };

            // Populate the details section
            detailsImage.src = productImage;
            detailsTitle.textContent = productTitle;
            detailsPrice.textContent = `$${productPrice}`;

            // Show the details section
            detailsSection.style.display = "block";
            detailsSection.scrollIntoView({ behavior: "smooth" });
        });
    });

    // Add item to cart with selected size and color
    addToCartBtn.addEventListener("click", () => {
        if (!currentProduct) return;

        const selectedSize = sizeSelect.value;
        const selectedColor = colorSelect.value;

        // Create cart item object
        const cartItem = {
            ...currentProduct,
            size: selectedSize,
            color: selectedColor,
        };

        addCartItem(cartItem);

        // Hide the details section after adding to cart
        detailsSection.style.display = "none";
        alert(`${cartItem.name} (Size: ${cartItem.size}, Color: ${cartItem.color}) has been added to your cart.`);
    });

    // Function to add item to cart table
    function addCartItem(cartItem) {
        const cartTableBody = document.querySelector(".cart tbody");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cartItem.name} (Size: ${cartItem.size}, Color: ${cartItem.color})</td>
            <td>$${cartItem.price.toFixed(2)}</td>
            <td>1</td>
            <td>$${cartItem.price.toFixed(2)}</td>
        `;
        cartTableBody.appendChild(row);
    }

});

