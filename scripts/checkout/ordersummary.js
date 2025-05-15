import { 
  cart,
  removeFromCart, 
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption
} from "../../data/cart.js";
import { products , getProduct } from "../../data/products.js";
import {formatCurrency}  from "../utils/money.js";
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions , getDeliveryOption 
} from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from "./paymentsummary.js";
import {renderCheckoutHeader} from './checkoutHeader.js';

export function renderOrderSummary(){

 let cartSummaryHtml = "";

 cart.forEach((cartItem) => {
   const productId = cartItem.productId;

   const matchingProduct = getProduct(productId);

   const deliveryOptionId = cartItem.deliveryOptionsId;

   const deliveryOption = getDeliveryOption(deliveryOptionId);

  //  const today = dayjs();
  //  const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
  //  const dateString = deliveryDate.format('dddd, MMMM D');

  const dateString = calculateDeliveryDate(deliveryOption);

   cartSummaryHtml += `
   <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
     <div class="delivery-date">
       Delivery date: ${dateString}
     </div>

     <div class="cart-item-details-grid">
       <img class="product-image"
         src="${matchingProduct.image}">

       <div class="cart-item-details">
         <div class="product-name">
           ${matchingProduct.name}
         </div>
         <div class="product-price">
           ${matchingProduct.getPrice()}
         </div>
         <div class="product-quantity js-product-quantity-${matchingProduct.id}">
           <span>
             Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
           </span>
           <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
             Update
           </span>
           <input class="quantity-input js-quantity-input-${matchingProduct.id}">
           <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
           <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
             Delete
           </span>
         </div>
       </div>

       <div class="delivery-options">
         <div class="delivery-options-title">
           Choose a delivery option:
         </div>
         ${deliveryOptionsHTML(matchingProduct, cartItem)}
       </div>
     </div>
   </div>
   `;
 });

 function deliveryOptionsHTML(matchingProduct, cartItem){

   let html = '';

   deliveryOptions.forEach((deliveryOption) => {
    //  const today = dayjs();
    //  const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    //  const dateString = deliveryDate.format('dddd, MMMM D');

     const dateString = calculateDeliveryDate(deliveryOption);

     const priceString = deliveryOption.priceCents === 0 ? 'Free' : `$${formatCurrency(deliveryOption.priceCents)} -`
     
     const isChecked = deliveryOption.id === cartItem.deliveryOptionsId;

     html += `
     <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}"
     data-delivery-option-id="${deliveryOption.id}">

       <input type="radio"
         ${isChecked ? 'checked' : ''}
         class="delivery-option-input"
         name="delivery-option-${matchingProduct.id}">
       <div>
         <div class="delivery-option-date">
           ${dateString}
         </div>
         <div class="delivery-option-price">
           ${priceString} Shipping
         </div>
       </div>
     </div>
     `
   })

   return html;
 }

 document.querySelector(".js-order-summary").innerHTML = cartSummaryHtml;

 document.querySelectorAll(".js-delete-link").forEach((link) => {
   link.addEventListener("click", () => {
     const productId = link.dataset.productId;
     
     removeFromCart(productId);
     const container = document.querySelector(`.js-cart-item-container-${productId}`)
     
     container.remove();
     renderCheckoutHeader();
     renderPaymentSummary();
   });
 });

 function updateCartQuantity() {
   const cartQuantity = calculateCartQuantity();

   document.querySelector('.js-return-to-home-link')
   .innerHTML = `${cartQuantity} items`;
 }


 document.querySelectorAll('.js-update-link')
   .forEach((link) => {
     link.addEventListener('click', () => {
       const productId = link.dataset.productId;
       const container = document.querySelector(
         `.js-cart-item-container-${productId}`
       );
       container.classList.add('is-editing-quantity');
     });
 });

 document.querySelectorAll('.js-save-link')
   .forEach((link) => {
     const productId = link.dataset.productId;
     const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

     link.addEventListener('click', () => {
       handleUpdateQuantity(productId, quantityInput);
       renderPaymentSummary();
       renderOrderSummary();
     });

     quantityInput.addEventListener('keydown', (event) => {
       if(event.key === 'Enter'){
         handleUpdateQuantity(productId, quantityInput);
         renderPaymentSummary();
         renderOrderSummary();
       }
     })
 });

 function handleUpdateQuantity(productId, quantityInput){
    const newQuantity = Number(quantityInput.value);

    if (newQuantity < 0 || newQuantity >= 1000) {
      alert('Quantity must be at least 0 and less than 1000');
      return;
    }

    updateQuantity(productId, newQuantity);

    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`)

    quantityLabel.innerHTML = newQuantity;

    renderCheckoutHeader();

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    container.classList.remove('is-editing-quantity');
 }

 document.querySelectorAll('.js-delivery-option').forEach((element) => {
   element.addEventListener('click', ()=>{
     const {productId, deliveryOptionId} = element.dataset;
     updateDeliveryOption(productId, deliveryOptionId);
     renderCheckoutHeader();
     renderOrderSummary();
     renderPaymentSummary();
   })
 })
 
}

function weekendDaysCount(initialDeliveryDays) {
  let weekendDaysCount = 0
  const weekendDays = ['Saturday', 'Sunday']
  const today = dayjs()
  for (let i = 1; i <= initialDeliveryDays + weekendDaysCount; i++) {
    const check = today.add(i, 'days').format('dddd')
    if (weekendDays.includes(check)) {
      weekendDaysCount++
    }
  }
  return weekendDaysCount
}


export function calculateDeliveryDate(deliveryOption) {
  let initialDeliveryDays = deliveryOption.deliveryDays
  let addWeekendDays = 0
  addWeekendDays = weekendDaysCount(initialDeliveryDays)
  const today = dayjs()
  const deliveryDays = initialDeliveryDays + Number(addWeekendDays)
  const deliveryDate = today.add(deliveryDays, 'days')
  const dateString = deliveryDate.format('dddd, MMMM D')
  return dateString
}

