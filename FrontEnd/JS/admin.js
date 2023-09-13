//-----------------ADMIN MODE--------------------------//

//------------Récupération du localStorage------------//

const token = localStorage.getItem("token");
if (token != undefined) {
  //------------Affichage de chaques éléments-------------//

  const adminElements = document.querySelectorAll("#adminMode");
  adminElements.forEach((adminMode) => {
    adminMode.style.display = "flex";
  });
  //----------Enlever les filtres----------//

  const filtersElement = document.getElementById("contener_filters");
  filtersElement.style.display = "none";
  //-------------Modifier "Login" en "Logout"-------------//

  const loginLink = document.getElementById("loginLink");
  loginLink.textContent = "logout";
  //--------Déconnexion quand on click sur "logout"--------//

  loginLink.addEventListener("click", (event) => {
    event.preventDefault();
    if (window.confirm("Etes-vous sur de vouloir vous déconnecter ?")) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      alert("Merci de votre visite !");
    }
  });
}

//-----------Récupération des Modales-----------//

const openModal = document.querySelector(".modif_modal");
const closeModals = document.querySelector(".fa-xmark");
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");

//--------Ouverture de la modale 1 quand on clique sur modifier------//

openModal.addEventListener("click", () => (modal1.style.display = "flex"));

//------------Fonction pour fermer les modales-------------//

const closeModal = () => {
  modal1.style.display = "none";
  modal2.style.display = "none";
};

//---------------Utilisation de la fonction-------------//

closeModals.addEventListener("click", () => closeModal());
modal1.addEventListener("click", (event) => {
  if (event.target === modal1) closeModal();
});
modal2.addEventListener("click", (event) => {
  if (event.target === modal2) closeModal();
});
document
  .querySelector("#modal2 .fa-xmark")
  .addEventListener("click", () => closeModal());

//-------Retourner à la modale 1 quand on clique sur la flèche-------//

const fleche = document.querySelector(".fa-arrow-left");
fleche.addEventListener("click", () => {
  modal2.style.display = "none";
  modal1.style.display = "flex";
});

//--------Affichage de la modale 2 quand on clique sur ajouter des images----------//

const addImages = document.querySelector(".button_add_images");
addImages.addEventListener("click", () => {
  modal1.style.display = "none";
  modal2.style.display = "flex";
});

//-------------Fonction pour générer le contenu de la modale 1-------------//

const modalProjects = (projects) => {
  const galleryModal = document.querySelector(".modal_gallery");
  const token = localStorage.getItem("token");

  //-------créer des balises pour chacun pour les injecter sur le HTML---------//

  projects.forEach((article) => {
    const figureModal = document.createElement("figure");
    figureModal.classList.add("figureEdit");

    //---------Ajout d'un attribut contenant l'URL de l'image correspondante dans la galerie------//

    figureModal.setAttribute("data-image-url", article.imageUrl);

    const contenairImg = document.createElement("div");
    contenairImg.classList.add("containerImg");

    const imgModal = document.createElement("img");
    imgModal.src = article.imageUrl;
    imgModal.crossOrigin = "anonymous";

    const editImg = document.createElement("p");
    editImg.innerText = "éditer";

    //------- Création d'une icône de corbeille------------//

    const corbeilleIcon = document.createElement("i");
    corbeilleIcon.classList.add("fa-solid", "fa-trash-can", "editIcon");

    //--------Utilisation d'un évènement de suppression-----------//

    corbeilleIcon.addEventListener("click", () => {
      //-------Utiliser la requête de suppression de l'API------------//
      fetch(`http://localhost:5678/api/works/${article.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        //-------Supprime l'élément du DOM correspondant à l'image dans la modale------//
        if (
          response.ok &&
          window.confirm("Etes-vous sur de vouloir supprimer la photo?")
        ) {
          figureModal.remove();
          //------Supprime l'élément correspondant dans la galerie principale---------//
          const imageUrl = figureModal.getAttribute("data-image-url");
          const galleryImg = document.querySelector(
            `.gallery figure img[src="${imageUrl}"]`
          );
          if (galleryImg) {
            galleryImg.parentElement.remove();
          }
        } else {
          throw new Error("Erreur lors de la suppression de l'image");
        }
      });
    });
    figureModal.append(contenairImg, editImg, corbeilleIcon);
    galleryModal.appendChild(figureModal);
    contenairImg.appendChild(imgModal);
  });
};

//-----------AJOUT NOUVEAU PROJET A LA GALERIE--------------//

const buttonNewImage = document.getElementById("button_new_images");
const inputFile = document.getElementById("input_file");
const blocAddImages = document.querySelector(".bloc_add_images");
const selectCategory = document.getElementById("category_list");
const buttonValidate = document.querySelector(".validate_button");
const inputTitle = document.getElementById("input_title");

//--------Ajout d'un écouteur d'événement sur le bouton d'ajout d'image-----//

buttonNewImage.addEventListener("click", () => inputFile.click());
//---------Ajout d'un écouteur d'événement "change" à l'élément inputFile-------//

inputFile.addEventListener("change", () => {
  //-----Création d'un élément image avec l'URL de l'objet fichier sélectionné--------//

  const newImage = new Image();
  newImage.src = URL.createObjectURL(inputFile.files[0]);
  //------Ajout d'un événement "load" à l'image qui révoque l'URL de l'objet une fois l'image chargée-----//

  newImage.addEventListener("load", () => URL.revokeObjectURL(newImage.src));
  blocAddImages.appendChild(newImage);
});

//------Récupération des catégories depuis l'API et ajout des options à la liste déroulante-------//

fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      selectCategory.appendChild(option);
    });
  });

//--------Ajout d'un écouteur d'événement sur le bouton de validation------//

buttonValidate.addEventListener("click", () => {
  //------Vérifier si tous les champs sont remplis avant d'envoyer les données-------//
  if (
    inputTitle.value &&
    selectCategory.value !== "none" &&
    inputFile.files.length > 0
  ) {
    //------Si tout est bon, créer un objet FormData avec les données du formulaire-------//

    const newFormData = new FormData();
    const file = inputFile.files[0];
    newFormData.append("image", file, file.name);
    newFormData.append("title", inputTitle.value);
    newFormData.append("category", selectCategory.value);
    //--------Envoyer les données au serveur------//

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: newFormData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Le projet a été ajouté avec succès !");
        //--------Créer un élément figure avec l'image et le titre-------//

        const project = document.createElement("figure");
        const imageElement = new Image();
        const titleElement = document.createElement("p");
        imageElement.src = data.imageUrl;
        titleElement.textContent = data.title;
        project.append(imageElement, titleElement);
        project.id = data.id;
        document.querySelector(".gallery").appendChild(project);
        document.getElementById("modal2").style.display = "none";
        window.location.reload();
      });
  } else {
    alert("Veuillez remplir tous les champs du formulaire !");
  }
});
