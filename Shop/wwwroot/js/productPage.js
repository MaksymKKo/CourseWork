//Start Program
if (!localStorage.getItem("cart")) {
    var initialCartString = JSON.stringify({});
    localStorage.setItem("cart", initialCartString);
}
var productId = document.getElementById("productId").value;
GetProduct(productId);


//Controls
async function GetProduct(productId)
{
    const response = await fetch("/api/Products/" + productId,
        {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    if (response.ok) {
        const product = await response.json();
        document.getElementById("productTitle").innerText = product.title;
        document.getElementById("productDescription").innerText = product.description;
        document.getElementById("productImg").src = product.picture;
        document.getElementById("productPrice").innerText = product.price + "₴";
        document.getElementById("productCharacteristics").innerText = product.characteristics;
        document.getElementById("buyBtn").setAttribute("product-id", product.id);
        GetCategory(product.category_id);
        var buyBtn = document.getElementById("buyBtn");
        buyClick(buyBtn);
    }
}
async function GetCategory(categoryId) {
    const response = await fetch("/api/Categories/" + categoryId,
        {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    if (response.ok) {
        const category = await response.json();
        document.getElementById("productCategory").innerText = category.title;
    }
}

function buyClick(btn) {
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        var productId = event.target.getAttribute('product-id');
        var items = JSON.parse(localStorage.getItem('cart'));
        if (!Array.isArray(items)) {
            items = [];
        }
        items.push({ productId: productId, userId: localStorage.getItem("userId") });
        localStorage.setItem('cart', JSON.stringify(items));
        alert("The product has been added to the cart. Thank you for your purchase!");
    });
}
