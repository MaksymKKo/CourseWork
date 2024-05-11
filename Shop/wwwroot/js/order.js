//Start Program
GetProducts();
//Controls
async function GetProducts() {
    document.getElementById("tbody").innerHTML = "";
    var id = document.getElementById("orderId").value;
    const response = await fetch("/api/Products/OrderProducts/" + id, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    if (response.ok) {
        var totalPrice = 0;
        const products = await response.json();
        var rows = document.querySelector("tbody");
        for (var i = 0; i < products.length; i++) {
            totalPrice += products[i].product.price * products[i].quantity; 
            rows.append(row(products[i], products[i].quantity)); 
        }
        document.getElementById("totalPrice").innerHTML = totalPrice;
    }
}

function row(product, quantity) {
    var tr = document.createElement("tr");

    var pictureTd = document.createElement("td");
    var picture = document.createElement("img");
    picture.src = product.product.picture;
    picture.alt = product.product.picture;
    picture.width = 110;
    picture.height = 130;
    pictureTd.append(picture);
    tr.appendChild(pictureTd);

    var titleTd = document.createElement("td");
    titleTd.append(product.product.title);
    tr.append(titleTd);

    var priceTd = document.createElement("td");
    priceTd.append(parseInt(product.product.price) * quantity + "₴");
    tr.append(priceTd);

    const quantityTd = document.createElement("td");
    quantityTd.id = "quantity";
    quantityTd.append(quantity);
    tr.append(quantityTd);
    tr.setAttribute("product-id", product.product.id);
    return tr;
}