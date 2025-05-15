import { renderOrderSummary } from './checkout/ordersummary.js'
import {renderPaymentSummary} from './checkout/paymentsummary.js'
import {renderCheckoutHeader} from './checkout/checkoutHeader.js'
import { loadProducts ,loadProductsFetch } from '../data/products.js';
import { loadCart } from '../data/cart.js';
// import '../data/backend-practice.js'
// import '../data/cart-class.js'

async function loadPage(){
  try {
    // throw 'error1';

    await loadProductsFetch();

    const value = await new Promise((resolve, reject) => {
      // throw 'error2';
      loadCart(() => {
        // reject('error3')
        resolve('value3');
      })
    });
  } catch (error) {
    console.log('error, Try again')
  } 
  
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
}

loadPage();

// Promise.all([
//   loadProductsFetch(),
//   new Promise((resolve) => {
//     loadCart(() => {
//       resolve();
//     })
//   })
// ]).then((values) => {
//   console.log(values)
//   renderCheckoutHeader();
//   renderOrderSummary();
//   renderPaymentSummary();
// });

// new Promise((resolve) => {
//   loadProducts(() => {
//     resolve('value1');
//   })
// }).then((value) => {
//   console.log(value)
//   return new Promise((resolve) => {
//     loadCart(() => {
//       resolve();
//     })
//   }); 
// }).then(() => {
//   renderCheckoutHeader();
//   renderOrderSummary();
//   renderPaymentSummary();
// })


// loadProducts(() => {
  // renderCheckoutHeader();

  // renderOrderSummary();
  
  // renderPaymentSummary();
// });

// loadProducts(() => {
//   loadCart(() => {
//     renderCheckoutHeader();
//     renderOrderSummary();
//     renderPaymentSummary();
//   });
// })