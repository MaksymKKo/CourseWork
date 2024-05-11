if (document.getElementById("logout")) {
    document.getElementById("logout").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem('cart');
        localStorage.removeItem('userId');
        window.location = "/Account/Logout";
    });
}