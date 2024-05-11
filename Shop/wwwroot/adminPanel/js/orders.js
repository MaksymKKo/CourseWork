//Start Program

GetOrders();

//Controls
async function GetOrders() {
    const response = await fetch("/api/Orders", {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    if (response.ok) {
        const orders = await response.json();
        var rows = document.querySelector("tbody");
        orders.forEach(order => {
            rows.append(row(order));
        });
    }
}

async function DeleteOrder(id) {
    const response = await fetch("/api/Orders/" + id,
        {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    if (response.ok) {
        const order = await response.json();
        document.querySelector(`tr[order-id="${order.id}"]`).remove();
    }
}

async function GetOrder(id) {
    const response = await fetch("/api/Orders/" + id,
        {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    if (response.ok) {
        const order = await response.json();
        document.getElementById("userId").value = order.user_id;
        document.getElementById("orderDate").value = order.orderDate;
        document.getElementById("totalSum").value = order.totalSum;
        document.getElementById("id").value = order.id;
    }
}

async function EditOrder(orderId, orderUserId, orderOrderDate, orderTotalSum) {
    const response = await fetch("/api/Orders/" + orderId, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: parseInt(orderId),
            user_id: parseInt(orderUserId),
            orderDate: orderOrderDate,
            totalSum: parseInt(orderTotalSum),
        })
    });
    if (response.ok) {
        const order = await response.json();
        document.querySelector(`tr[order-id="${order.id}"]`).replaceWith(row(order));
    }
}

document.getElementById("submit").addEventListener("click", e => {
    e.preventDefault();
    const orderUserId = document.getElementById("userId").value;
    const orderOrderDate = document.getElementById("orderDate").value;
    const orderTotalSum = document.getElementById("totalSum").value;
    const id = document.getElementById("id").value;
    if (id != "") {
        EditOrder(id, orderUserId, orderOrderDate, orderTotalSum);
    }

    document.getElementById("userId").value = "";
    document.getElementById("orderDate").value = "";
    document.getElementById("totalSum").value = "";
    document.getElementById("id").value = "";
});

document.getElementById("clear").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("userId").value = "";
    document.getElementById("orderDate").value = "";
    document.getElementById("totalSum").value = "";
    document.getElementById("id").value = "";
});

function row(order) {
    var tr = document.createElement("tr");

    var idTd = document.createElement("td");
    idTd.append(order.id);
    tr.append(idTd);

    var userIdTd = document.createElement("td");
    userIdTd.append(order.user_id);
    tr.append(userIdTd);

    var orderDateTd = document.createElement("td");
    orderDateTd.append(order.orderDate);
    tr.append(orderDateTd);

    var totalSumTd = document.createElement("td");
    totalSumTd.append(order.totalSum);
    tr.append(totalSumTd);

    const controlTd = document.createElement("td");
    const deleteTr = document.createElement("a");
    deleteTr.append("Delete");
    deleteTr.setAttribute("data-id", order.id);
    deleteTr.setAttribute("href", "#");
    deleteTr.setAttribute("class", "btn btn-danger");
    deleteTr.addEventListener("click", e => {
        e.preventDefault();
        DeleteOrder(order.id)
    });

    const updateTr = document.createElement("a");
    updateTr.append("Update");
    updateTr.setAttribute("data-id", order.id);
    updateTr.setAttribute("href", "#");
    updateTr.setAttribute("class", "btn btn-warning");
    updateTr.addEventListener("click", e => {
        e.preventDefault();
        GetOrder(order.id);
    });
    controlTd.append(deleteTr, updateTr);

    tr.append(controlTd);
    tr.setAttribute("order-id", order.id);
    return tr;
}
