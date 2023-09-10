//--------Récupération du projet----------//

let projects;

//----------Traiter les données en JSON-----------//

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    //------Stocke les données récupérées dans la variable projects------//
    projects = data;
    galleryProjects(projects);
    modalProjects(projects);
  })
  .catch((error) => console.error(error));

//--------------------PROJETS---------------------//

//------------Fonction pour ajouter les projets à la section galerie---------//

const galleryProjects = (projects) => {
  const sectionGallery = document.querySelector(".gallery");
  //-----------Faire une boucle for of --------------//

  for (const project of projects) {
    //--------Destructure les propriétés id, title et imageUrl de l'objet project--------//

    const { id, title, imageUrl } = project;
    //--------Créer un nouvel élément figure pour contenir l'image et le titre-----------//

    const projectFigureElement = document.createElement("figure");
    projectFigureElement.id = id;
    //--------Créer un nouvel élément image avec la source définie sur l'URL----------//

    const imageElement = new Image();
    imageElement.src = imageUrl;
    imageElement.crossOrigin = "anonymous";
    //----------Créer un nouvel élément pour contenir le titre-------------//

    const titleElement = document.createElement("p");
    titleElement.textContent = title;
    titleElement.classList.add("project_title_gallery");
    projectFigureElement.appendChild(imageElement);
    projectFigureElement.appendChild(titleElement);
    sectionGallery.appendChild(projectFigureElement);
  }
};

//----------------------FILTRES---------------------//

//----------Focntion pour supprimer tous les éléments de la section galerie----------//

const deleteList = () => {
  document.querySelector(".gallery").textContent = "";
};

//---------Ajout d'un bouton "Tous" pour afficher tous les projets--------//

const filters = document.getElementById("filters");
const btnAll = document.createElement("button");
btnAll.innerHTML = "Tous";
btnAll.id = "category";
btnAll.classList.add("button_filters");
filters.appendChild(btnAll);

//---------Supprime les projets actuels et affiche tous les projets grâce à la fonction-----------//

btnAll.addEventListener("click", () => {
  deleteList();
  galleryProjects(projects);
});

//----------Récupérer les données de catégorie depuis l'API et ajout des boutons-----------//

fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    for (const category of categories) {
      //---------Création d'un nouvel élément bouton pour chaque catégorie----------//

      const bouton = document.createElement("button");
      bouton.classList.add("button_filters");
      bouton.textContent = category.name;
      //----- Création d'un filtre pour filtrer les projets par catégorie et les afficher-----//

      bouton.addEventListener("click", () => {
        const filterProjects = projects.filter(
          (project) => project.category.name === category.name
        );
        deleteList();
        galleryProjects(filterProjects);
      });
      filters.appendChild(bouton);
    }
  })
  .catch((error) => console.error(error));
