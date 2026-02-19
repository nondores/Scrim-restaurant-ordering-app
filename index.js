import { menuArray } from "./data.js";

const orderList = document.getElementById('order-list');
const menuSection = document.querySelector('.menu-section')
const orderSection = document.querySelector('.order-section');
const orderTotalDisplay = document.getElementById('order-total');
const cardDetailsSection = document.querySelector('.card-details');
const paymentSuccessfulSection = document.querySelector('.payment-successful')


// CARD HOLDER

document.addEventListener('input', function(e) {
    const target = e.target;

    // CARD NUMBER
    if (target.id === 'card-number') {
        let value = target.value.replace(/\D/g, '').slice(0, 16);
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        target.value = value;
    }

    // EXPIRY DATE
    if(target.id === 'expiry-date') {
        let value = target.value.replace(/\D/g, '').slice(0, 4);

        if (value.length >=2) {
            let month = parseInt(value.slice(0,2));
            
            if (month > 12) month = 12;
            if (month <1) month = 1;
            
            value = month.toString().padStart(2, '0') + value.slice(2);
        }

        if (value.length >= 3) {
            value = value.slice(0,2) + '/' + value.slice(2)
        }

        target.value = value
    }

    // CVV
    if (target.id === 'cvv') {
        target.value = target.value.replace(/\D/g, '').slice(0,3)
    }

})

document.getElementById('card-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    if (cardNumber.length !== 16) {
        alert('Card number must be 16 digits');
        return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Expiry must be MM/YY');
        return;
    }

    if (cvv.length !== 3) {
        alert('CVV must be 3 digits');
        return;
    }
});


// ORDER MENU

document.addEventListener('click', function(e) {
    const addBtn = e.target.closest('[data-add]');
    const subtractBtn = e.target.closest('[data-subtract]');
    const removeBtn = e.target.closest('[data-remove]')
    const checkOutBtn = e.target.closest('#checkout-btn');
    const closeCardBtn = e.target.closest('#close-card-btn');
    const payBtn = e.target.closest('#pay-btn')

     // ADD/SUBTRACT MENU ITEMS

     if (addBtn || subtractBtn) {

        const targetId = addBtn?.dataset.add || subtractBtn?.dataset.subtract;
        const currentInput = document.getElementById(`order-item-${targetId}`);
        let currentValue = parseInt(currentInput.value);

        if (addBtn && currentValue < 10) {
            currentInput.value = currentValue + 1;
        } else if (subtractBtn && currentValue > 0) {
            currentInput.value = currentValue - 1;
        }

        renderOrderList();
        return;
    }

    // REMOVE BUTTON

    if (removeBtn) {
        const targetId = removeBtn.dataset.remove;
        const input = document.getElementById(`order-item-${targetId}`);
        input.value = 0;

        renderOrderList()
        return
    }

    // CHECKOUT BUTTON

    if (checkOutBtn) {
        cardDetailsSection.style.display = 'block';
        return;
    }

    if (closeCardBtn) {
        cardDetailsSection.style.display = 'none';
        return;
    }

    // PAY BUTTON
    if (payBtn) {
        e.preventDefault()
        renderPaymentMsg()
        return
    }

})

const renderPaymentMsg = () => {
    let msg = ''
    const holderName = document.getElementById('card-holder').value

    paymentSuccessfulSection.style.display = 'block'
    cardDetailsSection.style.display = 'none'; 
    orderSection.style.display = 'none'
    menuSection.style.display = 'none'

    msg += `
        <h2>Thanks, ${holderName}! Your order is on its way!</h2>
    `
    document.getElementById('message-container').innerHTML = msg
}

const renderOrderList = () => {
    let totalPrice = 0;
    let orderHtml = ''

    menuArray.forEach(item => {
        const qty = parseInt(document.getElementById(`order-item-${item.id}`).value)
        
        if (qty > 0) {
            const itemTotal = item.price * qty
            totalPrice += itemTotal

            orderHtml += `
                <li class="order-items">
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">${qty}x</span>
                        <span class="item-price">$${itemTotal.toFixed(2)}</span>
                    </div>
                    <button class="remove-btn" data-remove="${item.id}" aria-label="Remove item">&times;</button>
                </li>`;
        }
    })

    orderList.innerHTML = orderHtml
    orderTotalDisplay.textContent = `$${totalPrice.toFixed(2)}`;

    orderSection.style.display = totalPrice > 0 ? 'block' : 'none'
}


const getMenuHtml = () => {
    let menuHtml = '';

    menuArray.forEach(item => {
        let minusIconClass = '';
        let plusIconClass = '';

        menuHtml += `
            <div class="menu-item">
            <p class="food-emoji">${item.emoji}</p>
                <div class="item-details">
                    <p class="item-name">${item.name}</p>
                    <p class="item-ingredients">${item.ingredients.join(', ')}</p>
                    <p class="item-price">$${item.price}</p>
                </div>
                <div class="item-subs">
                        <span class="item-sub">
                            <i class="fa-solid fa-circle-minus ${minusIconClass}" data-subtract="${item.id}"></i>
                        </span>
                        <span class="item-sub">
                            <input type="number" class="order-item" id="order-item-${item.id}" value="0" size="2" readonly>
                        </span>
                        <span class="item-sub">
                            <i class="fa-solid fa-circle-plus ${plusIconClass}"
                            data-add = "${item.id}"
                            ></i> 
                        </span>
                </div>
            </div>
        `

        
    })
    return menuHtml;
}


const renderMenu = () => {
    document.getElementById('menu').innerHTML = getMenuHtml();
}

renderMenu();