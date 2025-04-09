const url = window.location.href
const header = document.querySelector('#header')
const cartState = localStorage.getItem('cartState')
const totalPriceFromStorage = localStorage.getItem('totalPrice')
// items from storage
const dataInStorage = JSON.parse(localStorage.getItem('allProductsData'))
const allPricesFromStorage = JSON.parse(localStorage.getItem('allPrices'))
// set counter
let counter = settingCounter()
// console.log(counter)

// arrays
let chosenProductsIds = []
let allPrices = []
let dataToSave = []

// functions
function calculateNewPrice(quantity, thisPrice) {
  $result = []
  const product = parseInt(quantity) * parseInt(thisPrice)
  $result.push(product)
  // console.log(product)
  printTotalPrice($result)
  // return product
}

function checkItemsQuantity() {
  // get cart menu
  const cartMenu = document.querySelector('#cart-menu')

  chosenProductsIds.map(id => {
    // find item to change
    const findItemInCart = cartMenu.querySelector(`.item-id-${id}`)
    // get parent element
    const thisCartItem = findItemInCart.closest('.cart-item')
    // get quantity element
    const quantityEl = thisCartItem.querySelector('.quantity')
    quantityEl.classList.remove('d-none')
    // get price
    const thisPrice = thisCartItem
      .querySelector('.cart-product-price')
      .textContent.trim()
      .split(' ')[1]
    console.log(thisPrice)

    //
    if (quantityEl.classList.contains('first-click')) {
      let quantity = parseInt(quantityEl.dataset.quantity)
      quantity += 1
      quantityEl.textContent = `Q. ${quantity} x $ ${thisPrice}`
      quantityEl.setAttribute('data-quantity', quantity)
      // calculate price for more than a single item
      calculateNewPrice(quantity, thisPrice)
    } else {
      // console.log("this is first click")
      const quantity = 2
      quantityEl.textContent = `Q. ${quantity} x $ ${thisPrice}`
      quantityEl.classList.add('first-click')
      quantityEl.setAttribute('data-quantity', quantity)
      // calculate price for more than a single item
      calculateNewPrice(quantity, thisPrice)
    }
  })
}

function settingCounter() {
  let counter
  if (localStorage.getItem('counter') !== null) {
    counter = localStorage.getItem('counter')
  } else {
    counter = 0
  }
  return counter
}

function printTotalPrice(prices) {
  // console.log(prices)
  const total = prices.reduce((total, currentPrice) => total + currentPrice, 0)
  // console.log(total)
  const totalResultEl = document.querySelector('#total-price')
  totalResultEl.textContent = `$ ${total}`
  // set total price, a number in storage to fetch later
  localStorage.setItem('totalPrice', total)
}

function decreaseTotalPrice(prices) {
  // console.log(prices)
  const total = prices.reduce((total, currentPrice) => total - currentPrice, 0)
  // console.log(total)
  const totalResultEl = document.querySelector('#total-price')
  if (total !== 0) {
    const result = total.toString().split('-')[1]
    totalResultEl.textContent = `$ ${result}`

    // set total price, a number in storage to fetch later
    localStorage.setItem('totalPrice', result)
  } else {
    totalResultEl.textContent = 0
    // set total price, a number in storage to fetch later
    localStorage.setItem('totalPrice', 0)
  }
}

function updateCounter() {
  if (counter === 0) {
    // hiding cart
    document.querySelector('.icon').classList.add('d-none')
    // clearing local storage
    localStorage.clear()
    // resetting arrays
    allPrices = []
    dataToSave = []
  }
  // updating counter in DOM
  document.querySelector('.items-number').textContent = counter
  // updating localStorage counter value
  localStorage.setItem('counter', counter)
}

function retrieveFromStorage(data) {
  // const data = JSON.parse(rawData)
  const cartMenu = document.querySelector('#cart-menu')

  data.map(item => {
    const cartItem = document.createElement('div')
    cartItem.classList.add('cart-item')
    cartItem.innerHTML = `
    <div class="cart-image" style="background-color: ${item.primaryColor}">
      <div class="cart-closed">
        <i class="fa-solid fa-xmark"></i>
      </div>
    </div>
    <div class="cart-description">
      <div class="cart-product-title">
        ${item.productName}
      </div>
      <div class="cart-product-price">
        ${item.productPrice}
      </div>
    </div>
    `
    // appening new element before cart total
    cartMenu.insertAdjacentElement('afterbegin', cartItem)
  })
}

function handleCart(e) {
  if (
    e.target.classList.contains('cart') ||
    e.target.classList.contains('fa-cart-shopping') ||
    e.target.classList.contains('items-number')
  ) {
    document.querySelector('#cart-menu').classList.toggle('d-none')
  }

  // remove an item from cart
  if (
    e.target.classList.contains('fa-xmark') ||
    e.target.classList.contains('cart-closed')
  ) {
    // get counter from storage
    if (localStorage.getItem('counter') !== null) {
      counter = parseInt(localStorage.getItem('counter'))
    }

    // decrementing counter
    counter--
    updateCounter()

    // get prices from storage
    if (allPricesFromStorage !== null) {
      allPrices = allPricesFromStorage
    }

    const thisCartItem = e.target.closest('.cart-item')
    const productName = thisCartItem
      .querySelector('.cart-product-title')
      .textContent.trim()
    const thisPrice = parseInt(
      thisCartItem
        .querySelector('.cart-product-price')
        .textContent.trim()
        .split(' ')[1]
    )

    // get product id
    const dataQuantity = parseInt(
      thisCartItem.querySelector('.quantity').dataset.quantity
    )

    if (dataQuantity >= 2) {
      const thisProductId = parseInt(
        thisCartItem.querySelector('.product-id').dataset.productId
      )
      // remove id product that is at least duplicated
      chosenProductsIds = chosenProductsIds.filter(id => id !== thisProductId)
    }

    // filtering all prices
    allPrices = allPrices.filter(currentPrice => currentPrice !== thisPrice)

    // decrease total price
    decreaseTotalPrice(allPrices)

    // remove from dom
    thisCartItem.remove()

    // get data from localStorage to remove some item from localStorage
    const data = JSON.parse(localStorage.getItem('allProductsData'))
    // filter item
    const newDataToStorage = data.filter(
      item => item.productName !== productName
    )
    // saving new localStorage
    localStorage.setItem('allProductsData', JSON.stringify(newDataToStorage))
    // updating localStorage prices array
    localStorage.setItem('allPrices', JSON.stringify(allPrices))
  }
}

function addItemsToCart(e) {
  if (e.target.classList.contains('add-to-cart')) {
    // incrementing counter
    counter++
    // updating counter
    updateCounter()

    if (dataInStorage) {
      dataToSave = dataInStorage
    }

    // get cart
    const cart = document.querySelector('.cart.icon')
    const cartMenu = document.querySelector('#cart-menu')
    // show cart
    cart.classList.remove('d-none')
    // set cart as visible in LocalStorage
    localStorage.setItem('cartState', true)

    // get data to create cart menu
    const descElem = e.target.parentElement.previousElementSibling
    const productName = descElem.querySelector('h2').textContent
    const productPrice = descElem.querySelector('h4').textContent
    const product = e.target.closest('.product')
    const primaryColor = product
      .querySelector('.product-image')
      .getAttribute('style')
      .split(':')[1]
      .trim()

    // write logic to sum data and print inside cart total
    const rightPrice = parseInt(productPrice.split(' ')[1].trim())

    if (allPricesFromStorage !== null) {
      allPrices = allPricesFromStorage
    }

    // get Item's Id
    const itemId = parseInt(
      e.target.parentElement.parentElement.dataset.productId
    )
    if (!chosenProductsIds.includes(itemId)) {
      // push id into array
      chosenProductsIds.push(itemId)
    } else {
      checkItemsQuantity()
      return
    }
    // console.log(chosenProductsIds)

    allPrices.push(rightPrice)
    printTotalPrice(allPrices)

    const jsonData = {
      id: itemId,
      primaryColor: primaryColor,
      productName: productName,
      productPrice: productPrice
      // quantity: 1
    }

    dataToSave.push(jsonData)

    // => store data in localStorage
    // storing counter in storage (Type: number)
    localStorage.setItem('counter', counter)
    // storing allProducts in storage (Type: Json)
    localStorage.setItem('allProductsData', JSON.stringify(dataToSave))
    // storing allPrices in storage (Type: Array)
    localStorage.setItem('allPrices', JSON.stringify(allPrices))

    // create a cart menu on right side screen
    const cartItem = document.createElement('div')
    cartItem.classList.add('cart-item')
    cartItem.innerHTML = `
    <div class="cart-image" style="background-color: ${primaryColor}">
      <div class="item-id-${itemId} product-id" data-product-id="${itemId}"></div>
      <div class="cart-closed">
        <i class="fa-solid fa-xmark"></i>
      </div>
    </div>
    <div class="cart-description">
      <div class="cart-product-title">
        ${productName}
      </div>
      <div class="cart-product-price">
        ${productPrice} <div class="quantity d-none"></div>
      </div>
    </div>
    `
    // appending new element before cart total
    cartMenu.insertAdjacentElement('afterbegin', cartItem)
  }
}

function printTeamData(data) {
  const teamGrid = document.querySelector('#team-grid')
  // loop
  data.map(item => {
    const teamCard = document.createElement('div')
    teamCard.classList.add('card')
    teamCard.innerHTML = `
    <div class="picture">
      <img src="img/picture2.avif" alt="profile picture">
    </div>
    <div class="info">
      <h3>${item.name}</h3>
      <p class="title">${item.work}</p>
    </div>
    `
    teamGrid.appendChild(teamCard)
  })
}

function printProductData(data) {
  const productsGrid = document.querySelector('#product-grid')
  // loop
  data.map(item => {
    const product = document.createElement('div')
    product.classList.add('product')
    product.innerHTML = `
    <div class="product-image" style="background-color: #${item.imageColor}"></div>
      <div class="product-description" data-product-id="${item.id}">
        <div class="desc">
          <h3>${item.category}</h3>
          <h2>${item.name}</h2>
          <h4>$ ${item.priceCents}</h4>
        </div>
      <div class="button">
          <button class="add-to-cart">Add To Cart</button>
      </div>
    </div>
    `
    productsGrid.appendChild(product)
  })
  // Add Event Listener
  productsGrid.addEventListener('click', addItemsToCart)
}

function injectTeams() {
  const endpoint = '/teams.json'
  fetch(endpoint)
    .then(res => res.json())
    .then(data => printTeamData(data))
    .catch(err => console.log(err))
}

function injectProducts() {
  const endpoint = '/items.json'
  fetch(endpoint)
    .then(res => res.json())
    .then(data => printProductData(data))
    .catch(err => console.log(err))
}

function createNavbar() {
  const html = `
    <div class="navbar">
      <ul class="navbar-list">
        <li><a href="index.html">Home</a></li>
        <li><a href="store.html">Store</a></li>
        <li><a href="team.html">Team</a></li>
      </ul>
    </div>

    <div class="icon cart ${cartState ? '' : 'd-none'}">
      <i class="fa-solid fa-cart-shopping"></i>
      <div class="items-number">${counter}</>
    </div>

    <div class="cart-menu d-none" id="cart-menu">
      
      <div class="cart-total-price">
        <div>TOTAL</div>
        <div class="total-price" id="total-price"></div>
      </div>
    </div>
    `
  header.innerHTML = html

  checkPage()

  if (dataInStorage) {
    retrieveFromStorage(dataInStorage)
  }

  if (totalPriceFromStorage !== null) {
    document.querySelector(
      '#total-price'
    ).textContent = `$ ${totalPriceFromStorage}`
  }
}

function checkPage() {
  const navbar = document.querySelector('.navbar')
  if (url.includes('index')) {
    navbar.querySelector('ul > li:nth-child(1) > a').classList.add('active')
  } else if (url.includes('store')) {
    navbar.querySelector('ul > li:nth-child(2) > a').classList.add('active')
  } else {
    navbar.querySelector('ul > li:nth-child(3) > a').classList.add('active')
  }
}

function init() {
  if (url.includes('store')) {
    document.addEventListener('DOMContentLoaded', injectProducts)
  }
  if (url.includes('team')) {
    document.addEventListener('DOMContentLoaded', injectTeams)
  }
  // add event listener
  document.addEventListener('DOMContentLoaded', createNavbar)
  header.addEventListener('click', handleCart)
}
// init
init()

// if(chosenProductsIds.includes(itemId)) {
//   const thisQuantity = cartItem.querySelector(".quantity.d-none")
//   thisQuantity.classList.remove("d-none")
//   thisQuantity.textContent = quantity++
// }

// => IDEAS
// ${productName} ${counterItems > 2 ? `x ${counterItems}` : ''}
// ${productPrice} ${counterItems > 2 ? `${productPrice} x ${counterItems}` : ''}
// // push id into array
// chosenProductsIds.push(itemId)
// // storing allProductIds in storage (Type: Array)
// localStorage.setItem('allProductIds', JSON.stringify(chosenProductsIds))

// IDEAS
// if(chosenProductsIds.includes(itemId)) {
//   counterItems++;
// }
