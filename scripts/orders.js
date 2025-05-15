import { addToCart, calculateCartQuantity } from "../data/cart.js";
import { orders } from "../data/orders.js";
import { products, getProduct } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";
import { loadProductsFetch } from "../data/products.js";
import formatCurrency from "./utils/money.js";
import { calculateDeliveryDate } from "./checkout/ordersummary.js";

let orderHTML = '';

await loadProductsFetch();

function loadPage(){
  document.querySelector('.cart-quantity').innerHTML = calculateCartQuantity()
  orders.forEach((order) => {
      let productPriceCents = 0;
      let shippingPriceCents = 0
      order.forEach((item) => {
        const product = getProduct(item.productId);
        productPriceCents += product.priceCents * item.quantity;

        const deliveryOption = getDeliveryOption(item.deliveryOptionsId);
        shippingPriceCents += deliveryOption.priceCents;
      })
      const totalBeforeTaxCents = productPriceCents + shippingPriceCents;

      const taxCents = totalBeforeTaxCents * 0.1;
      const totalCents = totalBeforeTaxCents + taxCents;
      orderHTML += `
        <div class="order-container">

        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order[0].date}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$ ${formatCurrency(totalCents)}</div>
            </div> 
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order[0].id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${order.map((item) => {
            const product = getProduct(item.productId);
            const deliveryOption = getDeliveryOption(item.deliveryOptionsId);
            const dateString = calculateDeliveryDate(deliveryOption);
            return `
          <div class="product-image-container">
            <img src="${product.image}">
          </div>

          <div class="product-details">
            <div class="product-name">
              ${product.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${dateString}
            </div>
            <div class="product-quantity">
              Quantity: ${item.quantity}
            </div>
            <button class="buy-again-button button-primary " data-product-id="${item.productId}">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html?orderId=${item.id}&productId=${item.productId}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
          `
          }).join("")}
        </div>
      </div>
      `
  })
}

loadPage();

document.querySelector('.orders-grid').innerHTML = orderHTML

document.querySelectorAll('.buy-again-button').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    addToCart(productId);
    document.querySelector('.cart-quantity').innerHTML = calculateCartQuantity()
  })
})

document.querySelectorAll('.track-package-button').forEach((button) => {
  button.addEventListener('click', () => {

  })
})  
