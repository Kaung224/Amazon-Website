import { products, getProduct } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";
import { loadProductsFetch } from "../data/products.js";
import { calculateDeliveryDate } from "./checkout/ordersummary.js";
import { orders } from "../data/orders.js";
import { calculateCartQuantity } from "../data/cart.js";

let trackingHTML = '';

await loadProductsFetch();

renderTrackingPage();

updateCartQuantity();

function getOrder(orderId, productId){
  let matchingOrder;
  let matchingProduct;
  orders.forEach((order) => {
    order.forEach((item) => {
      if(item.id === orderId){
        matchingOrder = order
      }
    })
  })

  matchingOrder.forEach((order) => {
    if(order.productId === productId){
      matchingProduct = order
    }
  })

  return matchingProduct;
}

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  document.querySelector(".cart-quantity").innerHTML = cartQuantity;
}

export function renderTrackingPage(){
  const url = new URL(window.location.href)
  const orderId = url.searchParams.get('orderId')
  const productId = url.searchParams.get('productId')
  const order = getOrder(orderId, productId)
  const product = getProduct(productId);
  const deliveryOption = getDeliveryOption(order.deliveryOptionsId);
  const dateString = calculateDeliveryDate(deliveryOption);

  trackingHTML = `
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${dateString}
      </div>

      <div class="product-info">
        ${product.name}
      </div>

      <div class="product-info">
       Quantity: ${order.quantity}
      </div>

      <img class="product-image" src="${product.image}">

      <div class="progress-labels-container">
        <div class="progress-label">
          Preparing
        </div>
        <div class="progress-label current-status">
          Shipped
        </div>
        <div class="progress-label">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>
    </div>
  `
  document.querySelector('.main').innerHTML = trackingHTML;
}