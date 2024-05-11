//Start Program
var orderPrice = 150;
GetProducts();
//Controls
async function GetProducts() {
    document.getElementById("tbody").innerHTML = "";
    var localProducts = [];
    GetLocalStorage(localProducts);
    if (localProducts.length > 0) {
        const response = await fetch("/api/Products", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (response.ok) {
            var totalPrice = 0;
            const products = await response.json();
            var rows = document.querySelector("tbody");
            for (var i = 0; i < localProducts.length; i++) {
                var correspondingProduct = products.find(product => product.id === parseInt(localProducts[i].productId));
                if (correspondingProduct) {
                    totalPrice += parseInt(correspondingProduct.price) * parseInt(localProducts[i].quantity);
                    rows.append(row(correspondingProduct, localProducts[i].quantity));
                }
            }
            document.getElementById("totalPrice").innerHTML = totalPrice + orderPrice;
        }
        document.getElementById("containerNoInfo").style.display = "none";
        document.getElementById("container").style.display = "flex";
    }
    else {
        document.getElementById("containerNoInfo").style.display = "block";
        document.getElementById("container").style.display = "none";
        document.getElementById("table").style.display = "none";
    }
}

function GetLocalStorage(newList) {
    var storedJsonString = localStorage.getItem('cart');
    var elements = JSON.parse(storedJsonString);
    if (!Array.isArray(elements)) {
        elements = [];
    }
    for (var i = 0; i < elements.length; i++) {
        var found = false;
        for (var j = 0; j < newList.length; j++) {
            if (newList[j].productId == elements[i].productId) {
                newList[j].quantity++;
                found = true;
                break;
            }
        }
        if (!found) {
            var element = { productId: elements[i].productId, userId: elements[i].userId, quantity: 1 };
            newList.push(element);
        }
    }
}
function row(product, quantity) {
    var tr = document.createElement("tr");

    var pictureTd = document.createElement("td");
    var picture = document.createElement("img");
    picture.src = product.picture;
    picture.alt = product.picture;
    picture.width = 110;
    picture.height = 130;
    pictureTd.append(picture);
    tr.appendChild(pictureTd);

    var titleTd = document.createElement("td");
    titleTd.append(product.title);
    tr.append(titleTd);

    var priceTd = document.createElement("td");
    priceTd.append(parseInt(product.price) * quantity + "₴");
    tr.append(priceTd);

    const controlTd = document.createElement("td");
    const deleteTr = document.createElement("a");
    deleteTr.append("Delete");
    deleteTr.setAttribute("data-id", product.id);
    deleteTr.setAttribute("href", "#");
    deleteTr.setAttribute("class", "btn btn-danger");
    deleteTr.addEventListener("click", e => {
        e.preventDefault();
        DeleteProductFromCart(product.id);
    });
    controlTd.append(deleteTr);

    const quantityTd = document.createElement("td");
    quantityTd.id = "quantity";
    quantityTd.append(quantity);
    tr.append(quantityTd);
    const quantityEditTd = document.createElement("td");
    const quantityInput = document.createElement("input");
    quantityInput.id = "quantityInput";
    quantityInput.value = quantity;
    quantityEditTd.append(quantityInput);

    const updateTr = document.createElement("a");
    updateTr.append("Update");
    updateTr.setAttribute("data-id", product.id);
    updateTr.setAttribute("href", "#");
    updateTr.setAttribute("class", "btn btn-warning");
    updateTr.addEventListener("click", e => {
        e.preventDefault();
        EditQuantity(product.id, quantity, e);
    });
    quantityEditTd.append(updateTr);

    tr.append(controlTd);
    tr.append(quantityEditTd);
    tr.setAttribute("product-id", product.id);
    return tr;
}

function DeleteProductFromCart(id) {
    var storedJsonString = localStorage.getItem('cart');
    var elements = JSON.parse(storedJsonString);
    if (!Array.isArray(elements)) {
        elements = [];
    }
    elements = elements.filter(function (element) {
        return parseInt(element.productId) !== id;
    });
    localStorage.setItem('cart', JSON.stringify(elements));
    GetProducts();
}

function EditQuantity(id, quantity, event) {
    var inQuantity = event.target.parentElement.querySelector("#quantityInput").value;
    if (inQuantity > 200 && inQuantity < 1) {
        alert("The entered number violates the rules of the available quantity of products for the buyer, the quantity will be automatically set to 1");
        inQuantity = 1;
    }
    document.getElementById("quantityInput").value = "";
    document.getElementById("quantity").innerHTML = inQuantity;

    var localProducts = [];
    GetLocalStorage(localProducts);
    var userId = localProducts[0].userId;
    var newCart = [];

    if (quantity < inQuantity) {
        var n = inQuantity - quantity;
        for (var i = 0; i < n; i++) {
            newCart.push({ productId: id, userId: userId });
        }
    }
    if (quantity > inQuantity) {
        var n = quantity - inQuantity;
        for (var i = 0; i < localProducts.length; i++) {
            if (localProducts[i].productId == id && n > 0) {
                localProducts[i].quantity -= n;
            }
        }
    }

    for (var i = 0; i < localProducts.length; i++) {
        if (localProducts[i].quantity < 2)
            newCart.push({ productId: localProducts[i].productId, userId: localProducts[i].userId });
        else
            for (var j = 0; j < localProducts[i].quantity; j++) {
                newCart.push({ productId: localProducts[i].productId, userId: localProducts[i].userId });
            }
    }
    var initialCartString = JSON.stringify(newCart);
    localStorage.setItem("cart", initialCartString);  

    GetProducts();
}

async function makeOrder() {
    const currentDate = new Date();
    var orderTotalSum = document.getElementById("totalPrice").innerHTML;
    var orderOrderDate = currentDate.toISOString().split('T')[0];
    var orderUserId = localStorage.getItem("userId");

    var products = [];
    var storedJsonString = localStorage.getItem('cart');
    var elements = JSON.parse(storedJsonString);
    if (!Array.isArray(elements)) {
        elements = [];
    }
    for (var i = 0; i < elements.length; i++) {
        var element = { productId: elements[i].productId };
        products.push(element);
    }


    const response = await fetch("/api/Orders/PostUserOrder", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: parseInt(orderUserId),
            orderDate: orderOrderDate,
            totalSum: parseInt(orderTotalSum),
            products: products
        })
    });
    if (response.ok) {
        alert("You have placed your order, thank you!");
        var initialCartString = JSON.stringify({});
        localStorage.setItem("cart", initialCartString);
        document.getElementById("containerNoInfo").style.display = "block";
        document.getElementById("container").style.display = "none";
        document.getElementById("table").style.display = "none";
    }
}

document.getElementById("makeOrder").addEventListener('click', makeOrder);
