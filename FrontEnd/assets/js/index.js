// Variables
const gallery = document.querySelector(".gallery");
let works = [];
let categories = [];
let createWorksCalled = false; //Variable qui suit l'etat de createWorks()

// Recuperer de maniere dynamique les projets
fetch("http://localhost:5678/api/works")
    .then(response => {
        if (!response.ok) {
            throw Error(`${response.status}`)
        }
        return response.json()
    })
    .then(galleryData => {
        works = galleryData;
        createWorks(); //Appele ici pour afficher les travaux initiaux sans tri
    })
    .catch(error => alert("Erreur : " + error))

//Recuperer de maniere dynamique les categories
fetch("http://localhost:5678/api/categories")
    .then(response => {
        if (!response.ok) {
            throw Error(`${response.status}`)
        }
        return response.json()
    })
    .then(categoriesData => {
        categories = categoriesData;
        createFilter();
    })
    .catch(error => alert("Erreur : " + error))

//Fonction de creer un nouveau projet
function createWorks(categoryId = 0) {

    //Filtrer les categories des projets
    const displayWorks = categoryId ? works.filter(work => work.categoryId === categoryId) : works;
    console.log("Projets affichés après filtrage :", displayWorks);
    //Vider la galerie avant d'ajouter les nouveaux projets
    gallery.innerHTML = "";

    //Ajouter des elements pour chaque projet filtre
    displayWorks.forEach(work => {
        // Créer une div pour chaque work, chaque div contient un id stipulant le n° de projet "work-n°"
        const workDiv = document.createElement("div");
        workDiv.setAttribute("id", `work-${work.id}`);
        // Créer un élément img pour afficher l'image du projet
        const workImg = document.createElement("img");
        workImg.src = work.imageUrl;
        workImg.setAttribute("alt", work.title);
        // Créer un élément <caption> pour afficher le titre du projet
        const workTitle = document.createElement("caption");
        workTitle.innerText = work.title;
        // Ajouter les éléments à la galerie. Des div dans .gallery, work.img et work.title dans la div
        gallery.appendChild(workDiv);
        workDiv.appendChild(workImg);
        workDiv.appendChild(workTitle);
    });

    // Afficher uniquement les projets filtrés
    displayWorks.forEach(work => {
        const workDiv = document.getElementById(`work-${work.id}`);
        workDiv.style.display = ''; // Réinitialiser l'affichage pour les projets filtrés
    });
}

//Ajouter des categories de filtres pour ensuite filtrer les projets
function createFilter() {
    //Ajouter une categorie par defaut
    categories.unshift({ id: 0, name: "Tous" });

    //Creer une div pour les categories
    const categoriesFilter = document.createElement("div");
    categoriesFilter.classList.add("categories");
    //Placer la div "categories" qu'on vient de creer avant la div .gallery
    portfolio.insertBefore(categoriesFilter, gallery);

    //Ajouter les 3 autres categories
    categories.forEach((categoryElement, i) => {
        //Creer un bouton par categorie
        const categoryFilterButton = document.createElement("button");
        categoryFilterButton.innerText = categoryElement.name;
        categoryFilterButton.value = categoryElement.id;
        categoryFilterButton.classList.add("btn-category");
        //Ajouter une class au premier bouton
        if (i === 0) {
            categoryFilterButton.classList.add("category-selected")
        };

        //Ajouter des boutons dans la div des filtres
        categoriesFilter.appendChild(categoryFilterButton);

        // Changer de categorie en fonction du clic de l'utilisateur
        categoryFilterButton.addEventListener("click", (e) => {
            // Sortir l'ID de la categorie selectionnee
            const selectedCategoryId = parseInt(e.target.value);

            // Appeler createWorks() avec la nouvelle categorie selectionnee
            createWorks(selectedCategoryId);

            // Réinitialiser createWorksCalled pour permettre la sélection d'un autre filtre
            createWorksCalled = false;

            // Changer la couleur des boutons
            const filterCategoryButtons = document.querySelectorAll(".btn-category");
            filterCategoryButtons.forEach((filterButton) => {
                filterButton.classList.remove("category-selected");
            });
            // Ajouter la classe de selection au bouton clique
            e.target.classList.add("category-selected");
        });
    });
};

//Promesse pour attendre la creation des categories avant de masquer les elements
function waitForCategories() {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (document.querySelector(".categories")) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
}

//Pour afficher ou masquer des elements lorsque l'utilisateur est connecte
document.addEventListener("DOMContentLoaded", async () => {
    //Verifier que le token est bien stocke dans sessionStorage
    const token = sessionStorage.getItem("token");
    const loginLink = document.getElementById("loginLink");

    if (token) {
        //L'utilisateur est donc connecte ici
        const editModeElements = document.querySelectorAll(".edit-mode");
        editModeElements.forEach(element => {
            element.style.display = "flex";
        });

        const editWorksElements = document.querySelectorAll(".edit-works");
        editWorksElements.forEach(element => {
            element.style.display = "flex";
        });

        //Changer le bouton login en logout
        loginLink.innerText = "logout";

        //Attendre la creation des categories avant de masquer les elements
        await waitForCategories();

        const categoriesElements = document.querySelectorAll(".categories");
        categoriesElements.forEach(element => {
            element.style.display = "none";
        });
    } else {
        loginLink.innerText = "login";
    }
});