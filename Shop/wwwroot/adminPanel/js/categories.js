//Start Program

GetCategories();

//Controls
async function GetCategories() {
    const response = await fetch("/api/Categories", {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    if (response.ok) {
        const categories = await response.json();
        var rows = document.querySelector("tbody");
        categories.forEach(category => {
            rows.append(row(category));
        });
    }
}

async function CreateCategory(categoryTitle) {
    const response = await fetch("/api/Categories", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: categoryTitle,
        })
    });
    if (response.ok) {
        const category = await response.json();
        var rows = document.querySelector("tbody");
        rows.append(row(category));
    }
}

async function DeleteCategory(id) {
    const response = await fetch("/api/Categories/" + id,
        {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    if (response.ok) {
        const category = await response.json();
        document.querySelector(`tr[category-id="${category.id}"]`).remove();
    }
}

async function GetCategory(id) {
    const response = await fetch("/api/Categories/" + id,
        {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    if (response.ok) {
        const category = await response.json();
        document.getElementById("title").value = category.title;
        document.getElementById("id").value = category.id;
        document.getElementById("formMethod").innerHTML = "Edit Category";
    }
}

async function EditCategory(categoryId, categoryTitle) {
    const response = await fetch("/api/Categories/" + categoryId, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: parseInt(categoryId),
            title: categoryTitle,
        })
    });
    if (response.ok) {
        const category = await response.json();
        document.querySelector(`tr[category-id="${category.id}"]`).replaceWith(row(category));
    }
}

document.getElementById("submit").addEventListener("click", e => {
    e.preventDefault();
    const categoryTitle = document.getElementById("title").value;
    const id = document.getElementById("id").value;
    if (id != "") {
        document.getElementById("formMethod").innerHTML = "Create Category";
        EditCategory(id, categoryTitle);
    }
    else
        CreateCategory(categoryTitle);

    document.getElementById("title").value = "";
    document.getElementById("id").value = "";
});

document.getElementById("clear").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("title").value = "";
    document.getElementById("id").value = "";
    document.getElementById("formMethod").innerHTML = "Create Category";
});

function row(category) {
    var tr = document.createElement("tr");

    var idTd = document.createElement("td");
    idTd.append(category.id);
    tr.append(idTd);

    var titleTd = document.createElement("td");
    titleTd.append(category.title);
    tr.append(titleTd);

    const controlTd = document.createElement("td");
    const deleteTr = document.createElement("a");
    deleteTr.append("Delete");
    deleteTr.setAttribute("data-id", category.id);
    deleteTr.setAttribute("href", "#");
    deleteTr.setAttribute("class", "btn btn-danger");
    deleteTr.addEventListener("click", e => {
        e.preventDefault();
        DeleteCategory(category.id)
    });

    const updateTr = document.createElement("a");
    updateTr.append("Update");
    updateTr.setAttribute("data-id", category.id);
    updateTr.setAttribute("href", "#");
    updateTr.setAttribute("class", "btn btn-warning");
    updateTr.addEventListener("click", e => {
        e.preventDefault();
        GetCategory(category.id);
    });
    controlTd.append(deleteTr, updateTr);

    tr.append(controlTd);
    tr.setAttribute("category-id", category.id);
    return tr;
}
