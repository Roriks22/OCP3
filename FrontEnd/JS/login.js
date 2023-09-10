//---------Récupération des valeurs-------//

const loginForm = document.getElementById("login_form");
const emailInput = document.getElementById("email_input");
const passwordInput = document.getElementById("password_input");
const erreurMessage = document.getElementById("erreur_message");

//----Ajout d'un événement de soumission du formulaire----//

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  //-------Récupération des valeurs email et mot de passe------//

  const email = emailInput.value;
  const password = passwordInput.value;
  //-----Condition si champs non rempli------//

  if (!email || !password) {
    erreurMessage.textContent = "Veuillez remplir tous les champs.";
    return;
  }

  //-----Appel à l'API avec les informations d'identification-----//

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      //-----Vérification de la réponse de l'API-----//

      if (!response.ok) {
        throw new Error("Mot de passe incorrect ou utilisateur introuvable.");
      }
      return response.json();
    })
    .then((data) => {
      //-----Utilisation du local stotage-----//

      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
      alert("Bonjour Sophie");
    })
    .catch((erreur) => {
      erreurMessage.textContent =
        "Mot de passe incorrect ou utilisateur introuvable.";
    });
});
