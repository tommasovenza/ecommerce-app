const header = document.querySelector("#header")
const url = window.location.href
const cartState = localStorage.getItem('cartState')
console.log(cartState);

function handleCart(e) {
  console.log(e.target)
  
  if(
    e.target.classList.contains("cart") || 
    e.target.classList.contains("fa-cart-shopping") || 
    e.target.classList.contains("items-number")
  ) {
    document.querySelector("#cart-menu").classList.toggle("d-none")
  }
}

function addItemsToCart(e) {
  // console.log(e.target)
  
  if(e.target.classList.contains("add-to-cart")) {
    console.log("clicked");
    // get cart
    const cart = document.querySelector(".cart.icon")
    // show cart
    cart.classList.remove("d-none")
    // set cart as visible in LocalStorage
    localStorage.setItem('cartState', true)
    // create a cart menu on right side screen
  }
}

function printTeamData(data) {
  console.log(data)
  const teamGrid = document.querySelector("#team-grid")
  // loop
  data.map(item => {
    const teamCard = document.createElement('div')
    teamCard.classList.add("card")
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
  console.log(data)
  const productsGrid = document.querySelector("#product-grid")
  // loop
  data.map(item => {
    const product = document.createElement('div')
    product.classList.add("product")
    product.innerHTML = `
    <div class="product-image" style="background-color: #${item.imageColor}"></div>
      <div class="product-description">
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
    // Add Event Listener
    productsGrid.addEventListener('click', addItemsToCart)
  })
}

function injectTeams() {
  const endpoint = "/teams.json"
  console.log(endpoint);

  fetch(endpoint)
    .then(res => res.json())
    .then(data => printTeamData(data))
    .catch(err => console.log(err))
}

function injectProducts() {
  const endpoint = "/items.json"
  console.log(endpoint);

  fetch(endpoint)
    .then(res => res.json())
    .then(data => printProductData(data))
    .catch(err => console.log(err))
}

function createNavbar() {
  // console.log("create")

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
      <div class="items-number">2</>
    </div>

    <div class="cart-menu d-none" id="cart-menu">
      <div class="cart-item">
        <div class="cart-image">
          <div class="cart-closed">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div class="cart-description">
          <div class="cart-product-title">
            Yellow
          </div>
          <div class="cart-product-price">
            $21.00
          </div>
        </div>
      </div>

      <div class="cart-total-price">
        <div>TOTAL</div>
        <div class="total-price">
          $3700
        </div>
      </div>
    </div>
    `
  header.innerHTML = html

  checkPage()
}

function checkPage() {
  const navbar = document.querySelector(".navbar")
  if(url.includes("index")) {
    navbar.querySelector("ul > li:nth-child(1) > a").classList.add('active')
  } else if(url.includes("store")) {
    navbar.querySelector("ul > li:nth-child(2) > a").classList.add('active')
  } else {
    navbar.querySelector("ul > li:nth-child(3) > a").classList.add('active')
  }
  // console.log(navbar)
}

function init() {
  if(url.includes('store')) {
    document.addEventListener("DOMContentLoaded", injectProducts)
    console.log("store page")
  }
  if(url.includes('team')) {
    document.addEventListener("DOMContentLoaded", injectTeams)
    console.log("team page")
  }
  // add event listener
  document.addEventListener("DOMContentLoaded", createNavbar)
  header.addEventListener('click', handleCart)
}
// init
init()

