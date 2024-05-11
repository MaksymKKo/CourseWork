//Start Program
var allProducts = [];
const pageSize = 4;
let curPage = 1;

var isStart = true;
var userStorage = JSON.parse(localStorage.getItem("cart"));
if (!Array.isArray(userStorage)) {
    userStorage = [];
}

localStorage.setItem("userId", document.getElementById("userId").value);
var userId = localStorage.getItem("userId");
if (userStorage.length < 1 || (userStorage[0].userId != userId && userStorage[0].userId != 0))
{
    var initialCartString = JSON.stringify({});
    localStorage.setItem("cart", initialCartString);    
}
if (document.getElementById("userIdentity").value == false) {
    if (userStorage.length > 0 && userStorage[0].userId != 0 && userId != 0) {
        var initialCartString = JSON.stringify({});
        localStorage.setItem("cart", initialCartString);
        localStorage.setItem("userId", 0);
        document.getElementById("userId").value = 0;
    }
}
else {
    if (userStorage.length > 0) {
        if (userStorage[0].userId == 0) {
            for (var i = 0; i < userStorage.length; i++) {
                userStorage[i].userId = userId;
            }
            var initialCartString = JSON.stringify(userStorage);
            localStorage.setItem("cart", initialCartString);
        }
    }
}

GetProducts(isStart);

//Controls
async function GetProducts(isStart) {
    curPage = 1;
    const response = await fetch("/api/Products", {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    if (response.ok) {
        const products = await response.json();
        allProducts = products;
        generatePage(allProducts);
        if (isStart) {
            GetCategories(products);
            isStart = false;
        }
    }
}

async function GetProductsByCategory(category_id) {
    curPage = 1;
    var productsDiv = document.getElementById("menu");
    productsDiv.disabled = true;
    const response = await fetch("/api/Products/ProductsByCategory/" + category_id, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    if (response.ok) {
        const products = await response.json();
        allProducts = products;
        generatePage(allProducts);
        productsDiv.disabled = false;
    }
}

async function GetProductsByTitle(title) {
    curPage = 1;
    if (title.length < 2) {
        alert("The searched value is too short");
    }
    else {
        var search = document.getElementById("findBtn");
        search.disabled = true;
        const response = await fetch("/api/Products/ProductsByTitle/" + title, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (response.ok) {
            const products = await response.json();
            if (products.length > 0) {
                allProducts = products;
                generatePage(allProducts);
            }
            else
                alert("Sorry, not found");
            search.disabled = false;
        }
    }
}

function generatePage(products, page = 1) {
    if (page == 1) { prevButton.classList.add('disabled'); }
    else { prevButton.classList.remove('disabled'); }

    if (page == numPages()) { nextButton.classList.add('disabled'); }
    else { nextButton.classList.remove('disabled'); }

    var div = document.getElementById("productsDiv");
    div.innerHTML = "";
    products.filter((row, index) => {
        let start = (curPage - 1) * pageSize;
        let end = curPage * pageSize;
        if (index >= start && index < end) return true;
    }).forEach(product => {
        div.append(card(product));
    });
    var buyBtns = document.getElementsByClassName("buy");
    var cards = document.getElementsByClassName("card");
    cardsClick(cards);
    buyClick(buyBtns, localStorage.getItem("userId"));
}

//Pagination
function numPages() {
    return Math.ceil(allProducts.length / pageSize);
}

function previousPage() {
    if (curPage > 1) {
        curPage--;
        generatePage(allProducts,curPage);
    }
}

function nextPage() {
    if ((curPage * pageSize) < allProducts.length) {
        curPage++;
        generatePage(allProducts,curPage);
    }
}
//

async function GetCategories(products) {
    const response = await fetch("/api/Categories", {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    if (response.ok) {
        const categories = await response.json();
        var div = document.getElementById("menu-list");
        categories.forEach(category => {
            div.append(menuItem(category, products));
        });
        var items = document.getElementsByClassName("list-group-item");
        menuItemsClick(items);
    }
}

function menuItem(category, products) {
    var item = document.createElement("button");
    item.classList.add("list-group-item", "list-group-item-action");
    item.textContent = category.title;
    item.setAttribute("category-id", category.id);
    var hasProductsInCategory = products.some(function (product) {
        return product.category_id === category.id;
    });
    if (!hasProductsInCategory) {
        item.disabled = true;
    }
    return item;
}

function card(product) {
    var cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.style.width = "25rem";

    var img = document.createElement("img");
    img.src = product.picture;
    img.classList.add("card-img-top");
    img.alt = product.title;

    var cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList.add("card-body");

    var title = document.createElement("h3");
    title.classList.add("card-title");
    title.textContent = product.title;

    var priceDiv = document.createElement("div");
    priceDiv.classList.add("priceDiv");
    var price = document.createElement("h2");
    price.classList.add("card-title");
    price.textContent = product.price + "₴";
    priceDiv.appendChild(price);

    var text = document.createElement("p");
    text.classList.add("card-text");
    text.textContent = product.description;

    var btnDiv = document.createElement("div");
    btnDiv.classList.add("btnDiv");
    var link = document.createElement("a");
    //Add to cart
    link.style.marginRight = "5px";
    link.classList.add("btn", "btn-primary", "card-controls", "buy");
    link.textContent = "Buy";

    var linkToInfo = document.createElement("a");
    linkToInfo.href = "/Home/Product/" + product.id;
    linkToInfo.classList.add("btn", "btn-warning", "card-controls");
    linkToInfo.textContent = "Info";
    btnDiv.appendChild(link);
    btnDiv.appendChild(linkToInfo);

    cardBodyDiv.appendChild(title);
    cardBodyDiv.appendChild(text);


    cardDiv.appendChild(img);
    cardDiv.appendChild(cardBodyDiv);
    cardDiv.appendChild(priceDiv);
    cardDiv.appendChild(btnDiv);
    cardDiv.setAttribute("product-id", product.id);
    return cardDiv;
}

//Actions
function cardsClick(elements) {
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('dblclick', (event) => {
            if (!event.target.classList.contains('btn')) {
                var productId = event.target.closest('.card').getAttribute('product-id');
                window.location = "/Home/Product/" + productId;
            }
        });
    }
}

function menuItemsClick(elements) {
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', (event) => {
            if (!event.target.classList.contains('active')) {
                var items = document.getElementsByClassName("list-group-item");
                for (var j = 0; j < items.length; j++) {
                    items[j].classList = "list-group-item";
                    items[j].classList.add("list-group-item-action");
                }
                event.target.classList = "list-group-item list-group-item-success active";
                var getId = event.target.getAttribute('category-id');
                if (getId == 0)
                    GetProducts();
                else 
                    GetProductsByCategory(event.target.getAttribute('category-id'));
            }
        });
    }
}

document.getElementById("findBtn").addEventListener('click', (event) => {
    event.preventDefault();
    var input = document.getElementById("searchInput");
    GetProductsByTitle(input.value);
    var items = document.getElementsByClassName("list-group-item");
    for (var j = 0; j < items.length; j++) {
        items[j].classList = "list-group-item";
        items[j].classList.add("list-group-item-action");
    }
    input.value = "";
});

function buyClick(elements, userId)
{
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', (event) => {
            event.preventDefault();
            var productId = event.target.closest('.card').getAttribute('product-id');
            var items = JSON.parse(localStorage.getItem('cart'));
            if (!Array.isArray(items)) {
                items = [];
            }
            items.push({ productId: productId, userId: userId });
            localStorage.setItem('cart', JSON.stringify(items));
            alert("The product has been added to the cart. Thank you for your purchase!");
        });
    }
}

document.querySelector('#nextButton').addEventListener('click', nextPage, false);
document.querySelector('#prevButton').addEventListener('click', previousPage, false);