const form = document.querySelector(".formulary-form");
const errorMail = document.querySelector(".error-mail");
const errorPassword = document.querySelector(".error-password");

// Event listener for form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Récupération des valeurs des champs email et password
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Création de l'objet avec les identifiants
    const loginUsers = {
        email: email,
        password: password
    };

    // Envoi de la requête POST au serveur
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginUsers)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            } else {
                // Masquer les messages d'erreur si la réponse est correcte
                errorMail.style.display = "none";
                errorPassword.style.display = "none";
                return response.json();
            }
        })
        .then(data => {
            // Changer l'état du bouton, stocker le token et rediriger vers la page index.html
            sessionStorage.setItem("token", data.token);
            location.href = "index.html";
        })
        .catch(error => {
            // Gérer les erreurs basées sur le statut de réponse
            if (error.message === "401") {
                errorPassword.style.display = "block";
                errorMail.style.display = "none";
            } else if (error.message === "404") {
                errorMail.style.display = "block";
                errorPassword.style.display = "none";
            } else {
                alert("Erreur : " + error)
            }
        })
});