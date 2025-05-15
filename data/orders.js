import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order){
  const id = crypto.randomUUID();
  const today = dayjs().format('MMMM D')
  order.forEach(element => {
    element.date = today;
    element.id = id;
  });
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage(){
  localStorage.setItem('orders', JSON.stringify(orders));
}
