//Start Program

GetProducts();

//Controls
async function GetProducts() {
    const response = await fetch("/api/Products", {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    if (response.ok) {
        const products = await response.json();
        var rows = document.querySelector("tbody");
        products.forEach(product => {
            rows.append(row(product));
        });
    }
}

async function CreateProduct(productTitle, productDescription, productPicture, productPrice, productCharacteristics, productCategoryId) {
    const response = await fetch("/api/Products", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: productTitle,
            description: productDescription,
            picture: productPicture,
            price: productPrice,
            characteristics: productCharacteristics,
            category_Id: parseInt(productCategoryId)
        })
    });
    if (response.ok) {
        const product = await response.json();
        var rows = document.querySelector("tbody");
        rows.append(row(product));
    }
}

async function DeleteProduct(id) {
    const response = await fetch("/api/Products/" + id,
        {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    if (response.ok) {
        const product = await response.json();
        document.querySelector(`tr[product-id="${product.id}"]`).remove();
    }
}

async function GetProduct(id) {
    const response = await fetch("/api/Products/" + id,
        {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    if (response.ok) {
        const product = await response.json();
        document.getElementById("title").value = product.title;
        document.getElementById("description").value = product.description;
        document.getElementById("picture").value = product.picture;
        document.getElementById("price").value = product.price;
        document.getElementById("characteristics").value = product.characteristics;
        document.getElementById("categoryId").value = product.category_id;
        document.getElementById("id").value = product.id;
        document.getElementById("formMethod").innerHTML = "Edit Product";
    }
}

async function EditProduct(productId, productTitle, productDescription, productPicture, productPrice, productCharacteristics, productCategoryId) {
    const response = await fetch("/api/Products/" + productId, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: parseInt(productId),
            title: productTitle,
            description: productDescription,
            picture: productPicture,
            price: parseInt(productPrice),
            characteristics: productCharacteristics,
            category_Id: parseInt(productCategoryId)
        })
    });
    if (response.ok) {
        const product = await response.json();
        document.querySelector(`tr[product-id="${product.id}"]`).replaceWith(row(product));
    }
}

document.getElementById("submit").addEventListener("click", e => {
    e.preventDefault();
    const productTitle = document.getElementById("title").value;
    const productDescription = document.getElementById("description").value;
    const productPicture = document.getElementById("picture").value;
    const productPrice = document.getElementById("price").value;
    const productCharacteristics = document.getElementById("characteristics").value;
    const productCategoryId = document.getElementById("categoryId").value;
    const id = document.getElementById("id").value;
    if (id != "") {
        document.getElementById("formMethod").innerHTML = "Create Product";
        EditProduct(id, productTitle, productDescription, productPicture, productPrice, productCharacteristics, productCategoryId);
    }
    else
        CreateProduct(productTitle, productDescription, productPicture, productPrice, productCharacteristics, productCategoryId);

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("picture").value = "";
    document.getElementById("price").value = "";
    document.getElementById("characteristics").value = "";
    document.getElementById("categoryId").value = "";
    document.getElementById("id").value = "";
});

document.getElementById("clear").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("picture").value = "";
    document.getElementById("price").value = "";
    document.getElementById("characteristics").value = "";
    document.getElementById("categoryId").value = "";
    document.getElementById("id").value = "";
    document.getElementById("formMethod").innerHTML = "Create Product";
});

function row(product) {
    var tr = document.createElement("tr");

    var idTd = document.createElement("td");
    idTd.append(product.id);
    tr.append(idTd);

    var titleTd = document.createElement("td");
    titleTd.append(product.title);
    tr.append(titleTd);

    var descriptionTd = document.createElement("td");
    descriptionTd.append(product.description);
    tr.append(descriptionTd);

    var pictureTd = document.createElement("img");
    pictureTd.src = product.picture;
    pictureTd.alt = product.picture;
    pictureTd.width = 110;
    pictureTd.height = 130;
    tr.appendChild(pictureTd);

    var priceTd = document.createElement("td");
    priceTd.append(product.price);
    tr.append(priceTd);

    var characteristicsTd = document.createElement("td");
    characteristicsTd.append(product.characteristics);
    tr.append(characteristicsTd);

    var categoryIdTd = document.createElement("td");
    categoryIdTd.append(product.category_id);
    tr.append(categoryIdTd);

    const controlTd = document.createElement("td");
    const deleteTr = document.createElement("a");
    deleteTr.append("Delete");
    deleteTr.setAttribute("data-id", product.id);
    deleteTr.setAttribute("href", "#");
    deleteTr.setAttribute("class", "btn btn-danger");
    deleteTr.addEventListener("click", e => {
        e.preventDefault();
        DeleteProduct(product.id)
    });

    const updateTr = document.createElement("a");
    updateTr.append("Update");
    updateTr.setAttribute("data-id", product.id);
    updateTr.setAttribute("href", "#");
    updateTr.setAttribute("class", "btn btn-warning");
    updateTr.addEventListener("click", e => {
        e.preventDefault();
        GetProduct(product.id);
    });
    controlTd.append(deleteTr, updateTr);

    tr.append(controlTd);
    tr.setAttribute("product-id", product.id);
    return tr;
}
