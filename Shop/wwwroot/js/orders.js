GetOrders();

//Controls
async function GetOrders() {
    var id = localStorage.getItem("userId");
    const response = await fetch("/api/Orders/UserOrders/" + id, {
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
function row(order) {
    var tr = document.createElement("tr");

    var idTd = document.createElement("td");
    idTd.append(order.id);
    tr.append(idTd);

    var orderDateTd = document.createElement("td");
    orderDateTd.append(order.orderDate);
    tr.append(orderDateTd);

    var totalSumTd = document.createElement("td");
    totalSumTd.append(order.totalSum);
    tr.append(totalSumTd);

    var infoTd = document.createElement("td");
    var linkToInfo = document.createElement("a");
    linkToInfo.href = "/Home/Order/" + order.id;
    linkToInfo.classList.add("btn", "btn-info");
    linkToInfo.textContent = "Info";
    infoTd.appendChild(linkToInfo);
    tr.appendChild(infoTd);

    tr.setAttribute("order-id", order.id);
    return tr;
}