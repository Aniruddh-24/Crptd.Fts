window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrollBtn").style.display = "block";
    } else {
        document.getElementById("scrollBtn").style.display = "none";
    }
}

document.getElementById("scrollBtn").addEventListener("click", function() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
});

// nav 
var nav = document.getElementById('header');
var scrollUp = "scroll-up";
var scrollDown = "scroll-down";
var lastScroll = 0;

if (window.addEventListener) {
    window.addEventListener("scroll", scrollHandler);
} else {
    window.attachEvent("scroll", scrollHandler);
}

function scrollHandler() {
     var currentScroll = window.pageYOffset;
     if (currentScroll === 0) {
         nav.classList.remove(scrollDown);
         nav.classList.remove(scrollUp);
        return;
     }
     if (currentScroll > lastScroll && !nav.classList.contains(scrollDown)) {
                // down
        nav.classList.remove(scrollUp);
        nav.classList.add(scrollDown);
    } 
    else if (currentScroll < lastScroll && nav.classList.contains(scrollDown)) {
                // up
        nav.classList.remove(scrollDown);
        nav.classList.add(scrollUp);
    }
    lastScroll = currentScroll;
}

// cart 
let closeCart = document.querySelector('.closeCart');
let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

function viewCart(){
    window.location.href = "cartPage.html"
}

function setupUI() {
    let logout = document.getElementById("display_login");
    let login = document.getElementById("login_btn");
    let token = localStorage.getItem("isLoggedIn") === "true" || !!localStorage.getItem("email");
    let userName = document.getElementById("user_name");

    if (token) {
        if (logout) logout.style.display = "flex";
        if (login) login.style.display = "none";
        if (userName) userName.textContent = localStorage.getItem("userName") || "Guest";
    } else {
        if (logout) logout.style.display = "none";
        if (login) login.style.display = "inline-block";
    }
}

function logout(){
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("userName");
    localStorage.removeItem("isLoggedIn");
    setupUI();
}
setupUI();