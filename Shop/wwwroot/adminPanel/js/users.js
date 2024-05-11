//Start Program
var userId = document.getElementById("userId").value;
localStorage.setItem("userId", userId);
GetUsers();

//Controls
async function GetUsers() {
    const response = await fetch("/api/Users", {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });
    if (response.ok) {
        const users = await response.json();
        var rows = document.querySelector("tbody");
        users.forEach(user => {
            rows.append(row(user));
        });
    }
}

async function DeleteUser(id) {
    const userId = localStorage.getItem("userId");

    if (userId != id) {
        const response = await fetch("/api/Users/" + id,
            {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }
            });
        if (response.ok) {
            const user = await response.json();
            document.querySelector(`tr[user-id="${user.id}"]`).remove();
        }
    }
    else
        alert("Sorry, you can`t delete yourself");
}
async function GetUser(id) {
    const response = await fetch("/api/Users/" + id,
        {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        });
    if (response.ok) {
        const user = await response.json();
        document.getElementById("email").value = user.email;
        document.getElementById("password").value = user.password;
        document.getElementById("role").value = user.role;
        document.getElementById("id").value = user.id;
    }
}

async function EditUser(userId, userEmail, userPassword, userRole) {
    const item = {
        id: parseInt(userId),
        email: userEmail,
        password: userPassword,
        role: userRole,
    };
    const response = await fetch("/api/Users/" + userId,
        {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item)
        });
    if (response.ok) {
        const user = await response.json();
        document.querySelector(`tr[user-id="${user.id}"]`).replaceWith(row(user));
    }
}

document.getElementById("submit").addEventListener("click", e => {
    e.preventDefault();
    const userEmail = document.getElementById("email").value;
    const userPassword = document.getElementById("password").value;
    const userRole = document.getElementById("role").value;
    const id = document.getElementById("id").value;
    if (id != "")
        EditUser(id, userEmail, userPassword, userRole);

    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("role").value = "";
    document.getElementById("id").value = "";
});

document.getElementById("clear").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("role").value = "";
    document.getElementById("id").value = "";
});

function row(user) {
    var tr = document.createElement("tr");

    var idTd = document.createElement("td");
    idTd.append(user.id);
    tr.append(idTd);

    var emailTd = document.createElement("td");
   emailTd.append(user.email);
    tr.append(emailTd);

    var passwordTd = document.createElement("td");
    passwordTd.append(user.password);
    tr.append(passwordTd);

    var roleTd = document.createElement("td");
    roleTd.append(user.role);
    tr.append(roleTd);

    const controlTd = document.createElement("td");
    const deleteTr = document.createElement("a");
    deleteTr.append("Delete");
    deleteTr.setAttribute("data-id", user.id);
    deleteTr.setAttribute("href", "#");
    deleteTr.setAttribute("class", "btn btn-danger");
    deleteTr.addEventListener("click", e => {
        e.preventDefault();
        DeleteUser(user.id)
    });

    const updateTr = document.createElement("a");
    updateTr.append("Update");
    updateTr.setAttribute("data-id", user.id);
    updateTr.setAttribute("href", "#");
    updateTr.setAttribute("class", "btn btn-warning");
    updateTr.addEventListener("click", e => {
        e.preventDefault();
        GetUser(user.id);
    });
    controlTd.append(deleteTr, updateTr);

    tr.append(controlTd);
    tr.setAttribute("user-id", user.id);
    return tr;
}
