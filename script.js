const mobileMenuButton = document.getElementById('mobile-menu');
const navLinksContainer = document.getElementById('nav-menu');
const cartButton = document.getElementById('cart-button');
const cartDrawer = document.getElementById('cart-drawer');
const closeDrawer = document.getElementById('close-drawer');
const cartCountBadge = document.getElementById('cart-count');
const drawerItemsContainer = document.getElementById('drawer-items');
const cartTotalPriceDisplay = document.getElementById('cart-total-price');

let shoppingCartItemsArray = [];

if (mobileMenuButton && navLinksContainer) {
  mobileMenuButton.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
  });
}

if (cartButton && cartDrawer) {
  cartButton.addEventListener('click', () => {
    cartDrawer.classList.add('open');
  });
}

if (closeDrawer && cartDrawer) {
  closeDrawer.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
  });
}

function renderCartUiElements() {
  if (!cartCountBadge || !drawerItemsContainer || !cartTotalPriceDisplay) return;

  cartCountBadge.innerText = shoppingCartItemsArray.length;
  
  if (shoppingCartItemsArray.length === 0) {
    drawerItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
    cartTotalPriceDisplay.innerText = "₹0";
    return;
  }
  
  drawerItemsContainer.innerHTML = "";
  let calculatedTotalPriceAccumulator = 0;
  
  shoppingCartItemsArray.forEach((item, index) => {
    calculatedTotalPriceAccumulator += item.price;
    
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('cart-item-row');
    rowDiv.innerHTML = `
      <span>${item.name}</span>
      <span><strong>₹${item.price}</strong> <i class="fas fa-trash remove-item-btn" onclick="removeItemFromCart(${index})"></i></span>
    `;
    drawerItemsContainer.appendChild(rowDiv);
  });
  
  cartTotalPriceDisplay.innerText = `₹${calculatedTotalPriceAccumulator}`;
}

const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const cardContainer = event.target.closest('.product-card');
    if (!cardContainer) return;

    const productId = cardContainer.getAttribute('data-id');
    const productName = cardContainer.getAttribute('data-name');
    const productPrice = parseInt(cardContainer.getAttribute('data-price'), 10);
    
    shoppingCartItemsArray.push({
      id: productId,
      name: productName,
      price: productPrice
    });
    
    renderCartUiElements();
  });
});

window.removeItemFromCart = function(targetIndex) {
  shoppingCartItemsArray.splice(targetIndex, 1);
  renderCartUiElements();
};

window.proceedToWhatsAppCheckout = function() {
  // Check kijiye cart khali toh nahi hai
  if (shoppingCartItemsArray.length === 0) {
    alert("Aapka shopping cart khali hai! Please items add karein.");
    return;
  }

  // Name check 
  const customerNameInput = document.getElementById('cust-name');
  if (!customerNameInput) return;

  const customerNameValue = customerNameInput.value.trim();
  
  if (customerNameValue === "") {
    alert("Kripya order bhejne ke liye apna Naam zaroor likhein!");
    customerNameInput.focus();
    return;
  }

  const myStoreWhatsAppNumber = "919876543210"; 

  let orderMessageBody = `*🛒 NEW ORDER RECEIVED - ORISON TEEWORKS*\n`;
  orderMessageBody += `=============================\n`;
  orderMessageBody += `👤 *Customer Name:* ${customerNameValue}\n`;
  orderMessageBody += `📅 *Date:* ${new Date().toLocaleDateString()}\n`;
  orderMessageBody += `=============================\n\n`;
  orderMessageBody += `📦 *ITEMS ORDERED:* \n`;

  let billAmountSum = 0;
  shoppingCartItemsArray.forEach((item, index) => {
    orderMessageBody += `🔹 ${index + 1}. ${item.name} — *₹${item.price}*\n`;
    billAmountSum += item.price;
  });

  orderMessageBody += `\n-----------------------------\n`;
  orderMessageBody += `💰 *TOTAL AMOUNT BILL:* 🔥 *₹${billAmountSum}*\n`;
  orderMessageBody += `-----------------------------\n\n`;
  orderMessageBody += `Hi Aman, maine upar diye gaye products aapki website se select kiye hain. Kripya mera order confirm karein aur aage ki details share karein!`;

  const cleanEncodedMessage = encodeURIComponent(orderMessageBody);
  const targetWhatsAppEndpoint = `https://wa.me/${myStoreWhatsAppNumber}?text=${cleanEncodedMessage}`;

  window.open(targetWhatsAppEndpoint, '_blank');
  
  shoppingCartItemsArray = [];
  renderCartUiElements();
  customerNameInput.value = "";
  if (cartDrawer) {
    cartDrawer.classList.remove('open');
  }
};