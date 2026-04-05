window.onload = () => document.body.classList.add('loaded');

// Scroll Observer for Animations and Nav
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if(window.scrollY > 40) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// WhatsApp config
const WHATSAPP_NUMBER = '2349044526924';

// Cart state (in-memory only, resets on refresh)
let cart = [];

const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountEls = document.querySelectorAll('.cart-count');
const cartCountTitle = document.querySelector('.cart-count-title');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const checkoutBtn = document.getElementById('checkout-btn');

function formatMoney(amount) {
    return '\u20A6' + parseInt(amount).toLocaleString();
}

function updateCartUI() {
    cartCountEls.forEach(el => el.textContent = cart.length);
    cartCountTitle.textContent = '(' + cart.length + ')';

    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'empty-msg';
        emptyMsg.textContent = 'Your bag is currently empty.';
        cartItemsContainer.appendChild(emptyMsg);
        checkoutBtn.disabled = true;
        cartSubtotalEl.textContent = '\u20A60';
    } else {
        checkoutBtn.disabled = false;
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += parseInt(item.price);

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            const img = document.createElement('div');
            img.className = 'c-item-img';
            img.style.background = item.gradient || '#EEE';

            const info = document.createElement('div');
            info.className = 'c-item-info';

            const title = document.createElement('h4');
            title.className = 'c-item-title';
            title.textContent = item.name;

            const price = document.createElement('p');
            price.className = 'c-item-price';
            price.textContent = formatMoney(item.price);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-item';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', function() {
                cart.splice(index, 1);
                updateCartUI();
            });

            info.appendChild(title);
            info.appendChild(price);
            info.appendChild(removeBtn);
            cartItem.appendChild(img);
            cartItem.appendChild(info);
            cartItemsContainer.appendChild(cartItem);
        });

        cartSubtotalEl.textContent = formatMoney(total);
    }
}

function openCart() {
    cartOverlay.classList.add('active');
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartFunc() {
    cartOverlay.classList.remove('active');
    cartSidebar.classList.remove('active');
    document.body.style.overflow = 'auto';
}

cartToggle.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
closeCart.addEventListener('click', closeCartFunc);
cartOverlay.addEventListener('click', closeCartFunc);

// Add to Cart — works on both click and touch (quick-add always visible on mobile via CSS)
document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const productCard = this.closest('.product-card');
        const imageWrap = productCard.querySelector('.p-image-wrap');
        const gradient = imageWrap ? imageWrap.style.background : '#EEE';
        const name = this.getAttribute('data-name');
        const price = this.getAttribute('data-price');
        const size = this.getAttribute('data-size');
        const itemName = size ? name + ' - Size ' + size : name;

        // Highlight selected size
        const sizeContainer = this.closest('.p-sizes');
        if (sizeContainer) {
            sizeContainer.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        }
        this.classList.add('selected');

        // Add to cart
        cart.push({ name: itemName, price: price, gradient: gradient });

        // Toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-msg';
        toast.textContent = '\u2714 Added ' + itemName;
        document.getElementById('toast-container').appendChild(toast);

        // Brief delay then open cart
        setTimeout(() => {
            updateCartUI();
            openCart();
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 2000);
        }, 400);
    });
});

// WhatsApp Checkout
checkoutBtn.addEventListener('click', function() {
    if(this.disabled || cart.length === 0) return;

    let total = 0;
    let lines = [];
    cart.forEach(function(item) {
        const p = parseInt(item.price);
        total += p;
        lines.push('- ' + item.name + ' (\u20A6' + p.toLocaleString() + ')');
    });

    const message = "Hi Ade & Co! I'd like to order:\n" + lines.join('\n') + '\nTotal: \u20A6' + total.toLocaleString();
    const encoded = encodeURIComponent(message);
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encoded, '_blank');
});

// Initialize cart UI
updateCartUI();
