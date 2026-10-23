var emailInput = document.getElementById("email");
var submitBtn = document.getElementById("btn-login");
var firstNameInput = document.getElementById("fname");
var lastNameInput = document.getElementById("lname");

if (submitBtn) {
    submitBtn.addEventListener("click", function() {
        var email = emailInput ? emailInput.value.trim() : "";
        var firstName = firstNameInput ? firstNameInput.value.trim() : "";
        var lastName = lastNameInput ? lastNameInput.value.trim() : "";
        var name = [firstName, lastName].filter(Boolean).join(" ");

        if (!name) {
            name = email.split("@")[0] || "Guest";
        }

        localStorage.setItem("email", email || "guest@local");
        localStorage.setItem("userName", name);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.removeItem("password");
        if (typeof setupUI === "function") {
            setupUI();
        }
        window.location.href = "index.html";
    });
}