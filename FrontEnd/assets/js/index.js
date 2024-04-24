//> VARIABLES

let works = [];
let categories = [];

//> VARIABLES PAGE .INDEX
// Bouton de connexion/déconnexion de la page .index
const switchLogout = document.querySelector('li a[href="login.html"]');
// Header de la page .index
const header = document.querySelector("header");
// h2 présent dans la div avec l'id "Portfolio"
const titlemyProjets = document.querySelector("#portfolio h2");
// Gallerie de la page .index
const gallery = document.querySelector(".gallery");

//> VARIABLES MODALE N°1
// 1ère modale
const firstModal = document.querySelector(".modal-deleted");
// Gallerie présente dans la 1ère modale
const ModalContentGallery = document.querySelector(".gallery-list");
// Message qui valide la suppression d'un projet
const messagePhotoDeleted = document.querySelector(".message-deleted");

//> VARIABLES MODALE N°2
// 2ème modale
const addModal = document.querySelector(".modal-add");
// Bouton "valider" de la 2ème modale
const btnValidAddModal = document.getElementById("btn-valid");
// Formulaire d'ajout d'un projet de la 2ème modale
const formPhoto = document.querySelector(".form-photo");
// Bouton "+ Ajouter une photo" de la 2ème modale
const btnAddFile = document.getElementById("file");
// Champ "Titre" du formulaire de la 2ème modale
const titleAddModal = document.getElementById("title-photo");
// Champ "Catégorie" du formulaire de la 2ème modale
const categorieAddModal = document.getElementById("categorie-photo");
// Div de preview de la photo chargée dans la 2ème modale
const previewNewPhoto = document.querySelector(".preview");
// Champ d'ajout de la photo de la 2ème modale
const contentAddPhoto = document.querySelector(".content-add-photo");



//> Récupérer de manière dynamique les projets

fetch("http://localhost:5678/api/works")
    .then(response => {
        if (!response.ok) {
            throw Error(`${response.status}`)
        }
        return response.json()
    })
    .then(galleryData => {
        works = galleryData;
        //Appele ici de createWorks() pour afficher les travaux initiaux sans tri
        createWorks(); 
    })
    .catch(error => alert("Erreur : " + error))

//> Récupérer de manière dynamique les catégories

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
        adminMode();
    })
    .catch(error => alert("Erreur : " + error))




//* GALERIE
//> Fonction pour créer un nouveau projet

function createWorks(categoryId = 0) {

    //Filtrer les catégories des projets
    const displayWorks = categoryId ? works.filter(work => work.categoryId === categoryId) : works;
    console.log("Projets affichés après filtrage :", displayWorks);

    //Vider la galerie avant d'ajouter les nouveaux projets
    gallery.innerHTML = "";

    //Ajouter des éléments pour chaque projet filtré
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

        // Réinitialiser l'affichage pour les projets filtrés
        workDiv.style.display = ''; 
    });
}

//* FILTRES
//> Ajouter des catégories de filtre pour filtrer les projets

function createFilter() {

    //Ajouter une catégorie par défaut
    categories.unshift({ id: 0, name: "Tous" });

    //Créer une div pour les catégories
    const categoriesFilter = document.createElement("div");
    categoriesFilter.classList.add("categories");

    //Placer la div "categories" qu'on vient de créer avant la div .gallery
    portfolio.insertBefore(categoriesFilter, gallery);

    //Ajouter les 3 autres catégories
    categories.forEach((categoryElement, i) => {

        //Créer un bouton par catégorie
        const categoryFilterButton = document.createElement("button");
        categoryFilterButton.innerText = categoryElement.name;
        categoryFilterButton.value = categoryElement.id;
        categoryFilterButton.classList.add("btn-category");

        //Ajouter une classe au premier bouton
        if (i === 0) {
            categoryFilterButton.classList.add("category-selected")
        };

        //Ajouter des boutons dans la div des filtres
        categoriesFilter.appendChild(categoryFilterButton);

        // Changer de catégorie en fonction du clic de l'utilisateur
        categoryFilterButton.addEventListener("click", (e) => {

            // Sortir l'ID de la catégorie sélectionnée
            const selectedCategoryId = parseInt(e.target.value);

            // Appeler createWorks() avec la nouvelle catégorie sélectionnée
            createWorks(selectedCategoryId);

            // Changer la couleur des boutons
            const filterCategoryButtons = document.querySelectorAll(".btn-category");
            filterCategoryButtons.forEach((filterButton) => {
                filterButton.classList.remove("category-selected");
            });

            // Ajouter la classe de sélection au bouton cliqué
            e.target.classList.add("category-selected");
        });
    });
};


//* ADMIN MODE
//> Fonction pour activer le mode admin

function adminMode(){

    // Vérifier qu'un token est bien stocké dans le stockage de session
    if(sessionStorage.getItem("token")){

        // Créer une <div> "mode édition" à ajouter au début du header
        const editModeBar = `<div class="edit-mode">
        <i class="logo-edit fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>
        </div>`;
        header.style.marginTop = "88px";
        header.insertAdjacentHTML("afterbegin", editModeBar);
        
        // Changer le texte "login" pour celui de "switchLogout"
        switchLogout.textContent = "logout";
        switchLogout.href = "#";
        
        switchLogout.addEventListener("click", () => {

            // Supprimer le token de la session et recharger la page
            sessionStorage.removeItem("token");
            location.reload();
        });

        // Créer une <div> pour modifier les projets avec le picto
        const containerDivBtn = document.createElement("div");
        containerDivBtn.classList.add("edit-projets");

        // Créer la <div> avec lien de la 1ère modale
        const btnToModified = `<div class="edit">
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
        </div>`;

        // Insérer le container avant le 1er élément du portfolio et déplacer les projets à l'intérieur
        portfolio.insertBefore(containerDivBtn, portfolio.firstChild);
        containerDivBtn.appendChild(titlemyProjets);

        // Ajouter le lien de modification après "Mes Projets"
        titlemyProjets.insertAdjacentHTML("afterend", btnToModified);

        
        // Cacher les boutons de filtres 
        const categoriesButtonsFilter = document.querySelectorAll('.category-btn');
        categoriesButtonsFilter.forEach(button => {
            button.style.display = 'none';
        });

        // Accès au bouton "Modifier"
        const editBtn = document.querySelector(".edit");
        if (editBtn) {

            // Si l'élément est trouvé, ajouter un eventListener au click
            editBtn.addEventListener("click", openModal);
        };
    };
};




//> Promesse pour attendre la création des catégories avant de masquer les éléments

function waitForCategories() {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {

            // Vérifie que les boutons de filtres par catégories sont bien présents
            if (document.querySelector(".categories")) {

                // Si l'élément est trouvé, l'exécution de l'intervalle se termine
                clearInterval(interval);

                // Si la promesse est résolue, "resolve()" est appelée
                resolve();
            }

            // Intervalle défini pour s'exécuter toutes les 100 millisecondes
        }, 100);
    });
}




//* UTILISATEUR CONNECTÉ
//> Conditions pour afficher ou masquer des éléments lorsque l'utilisateur est connecté

// EventListener pour vérifier que le .html soit entièrement chargé
document.addEventListener("DOMContentLoaded", async () => {

    const token = sessionStorage.getItem("token");
    const loginLink = document.getElementById("loginLink");

    // Si l'utilisateur est connecté
    if (token) {
        const editModeElements = document.querySelectorAll(".edit-mode");
        editModeElements.forEach(element => {

            // On affiche les éléments .edit-mode (barre noire du header)
            element.style.display = "flex";
        });

        const editWorksElements = document.querySelectorAll(".edit-works");
        editWorksElements.forEach(element => {

            // On affiche les éléments .edit-works (bouton "modifier")
            element.style.display = "flex";
        });

        // Changer le bouton login en logout
        loginLink.innerText = "logout";

        // Attendre la création des catégories avant de masquer les éléments
        await waitForCategories();

        const categoriesElements = document.querySelectorAll(".categories");
        categoriesElements.forEach(element => {

            // Masquer les boutons de tri par filtres
            element.style.display = "none";
        });

    } else {
        loginLink.innerText = "login";
    }

    // EventListener pour vérifier que le .html soit entièrement chargé
    document.addEventListener("DOMContentLoaded", () => {
        const token = sessionStorage.getItem("token");
        const loginLink = document.getElementById("loginLink");

        // Si l'utilisateur est connecté
        if (token) {

            // On rajoute un lien au bouton "modifier" que l'on a ajouté (.edit-works)
            const logoutLink = document.createElement("a");
            logoutLink.innerText = "logout";
            logoutLink.href = "javascript:void(0);";
            logoutLink.addEventListener("click", () => {

                // Déconnexion : Supprime le token du sessionStorage
                sessionStorage.removeItem("token");

                // Redirige vers la page de connexion
                location.href = "login.html";
            });

            // Remplacer le lien "login" par "logout"
            loginLink.parentNode.replaceChild(logoutLink, loginLink);

        // Utilisateur non connecté
        } else {
            loginLink.innerText = "login";
            loginLink.href = "login.html";
        }
    });

});

let modal = null




//* MODALE N°1
//> Fonction pour ouvrir la 1ère modale

const openModal = function (e) {
    e.preventDefault()
    // const target = document.querySelector(e.target.getAttribute("href"))
    modale = document.querySelector(".modale");
    modale.style.display = null;
    modale.removeAttribute("aria-hidden")
    modale.setAttribute("aria-modal", "true")
    
    modale.addEventListener("click", closeModal)
    modale.querySelector(".js-close-modal").addEventListener("click", closeModal)
    modale.querySelector(".js-close-stop").addEventListener("click", stopPropagation)

    displayWorksFirstModal();
}

// > Fonction pour fermer la 1ère modale

const closeModal = function (e) {
    if (modale === null) return
    // e.preventDefault() // ! Cette ligne engendrait le TypeError: Cannot read properties of undefined (reading 'preventDefault')
    modale.style.display = "none";
    modale.setAttribute("aria-hidden", "true")
    modale.removeAttribute("aria-modal")
    modale.removeEventListener("click", closeModal)
    modale.querySelector(".js-close-modal").removeEventListener("click", closeModal)
    modale.querySelector(".js-close-stop").removeEventListener("click", stopPropagation)
    modale = null
    // Appel de al fonction qui reinitialise les photos dans l'ajout 
    resetAddModal();
}

// > Pour que l'élément ne se ferme pas lorsque l'on clique dessus

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll(".js-modale").forEach(a => {
    a.addEventListener("click", openModal)
})


// > Fonction pour créer le contenu de la 1ère modale

function displayWorksFirstModal() {
    // Reinitialiser le contenu existant
    ModalContentGallery.innerHTML = "";

    //Ajouter des elements pour chaque projet filtre
    works.forEach(work => {
        // Créer une div pour chaque work, chaque div contient un id stipulant le n° de projet "work-n°"
        const figureModal = document.createElement("figure");
        figureModal.setAttribute("class", "figure-modal");
        figureModal.setAttribute("id", `modal-${work.id}`)
        // Créer un élément img pour afficher l'image du projet
        const imgFigureModal = document.createElement("img");
        imgFigureModal.src = work.imageUrl;
        imgFigureModal.setAttribute("class", "modal-img");

        // Ajouter les éléments à la galerie. Des div dans .gallery, work.img et work.title dans la div
        ModalContentGallery.appendChild(figureModal);
        figureModal.appendChild(imgFigureModal);

        // Ajouter l'icône de suppression
        const trashIcon = `<i class="fa-solid fa-trash-can delete-work" id = "trash-${work.id}"></i>`
        figureModal.insertAdjacentHTML("afterbegin", trashIcon);
        document.getElementById(`trash-${work.id}`).addEventListener("click", async (event) => {
                await deleteWork(work.id); 
            }); 
    });
};

// * SUPPRESSION WORK
// > Fonction pour supprimer un projet

async function deleteWork(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: null  
    })
    .then(response => {
        if (!response.ok) {
            throw Error(`${response.status}`);
        }
    })
    .then(() => {
        works = works.filter(work => work.id !== id);

        // Supprimer l'image de la modale
        displayWorksFirstModal();
        
        // Afficher le message pendant 1.5 secondes
        messagePhotoDeleted.style.display="flex";
        setTimeout(()=>{
            messagePhotoDeleted.style.display="none";
        }, 1500);

        // Supprimer l'image de la gallery
        createWorks();
    })
    .catch(error => alert("Erreur : " + error));
};


// * MODALE N°2
// > Fonction pour ouvrir la 2ème modale (ajout d'un projet)

const btnAddPhoto = document.querySelector(".add-photo");
btnAddPhoto.addEventListener("click", openAddModal);

function openAddModal () {
        // Cacher la première modale et faire apparaître la seconde
        firstModal.style.display = "none";
        addModal.style.display = "flex";

        //Appel de closeModal et stopPropagation pour fermer la modale sauf quand on clique sur elle
        const closeCrossBtn = document.querySelector(".close-add");
        closeCrossBtn.addEventListener("click", closeModal);
        addModal.addEventListener("click", stopPropagation);

        // Activer le bouton de retour à la première modale
        const returnModalIcon = document.querySelector(".return");
        returnModalIcon.addEventListener("click", returnFirstModal);

    // Appel de la fonction qui ajoute le choix de la categorie
    addSelectedCategories();
};

// > Fonction pour retourner à la première modale

function returnFirstModal() {
    // Cacher la modale d'ajout et faire reapparaitre la premiere modale
    addModal.style.display = "none";
    firstModal.style.display = "flex";

    // Appel de la fonction qui reinitialise la photo d'ajout 
    resetAddModal();
};

// > Fonction pour ajouter plusieurs catégories

function addSelectedCategories() {
    // Enlever le choix de la categorie "Tous"
    categories.shift();

    // Boucle pour chaque pour ajouter toutes les categories dans le champ de selection
    categories.forEach(category => {
        const categoryWork = document.createElement("option");
        categoryWork.setAttribute("value", category.id);
        categoryWork.setAttribute("name", category.name);
        categoryWork.innerText = category.name;
        categorieAddModal.appendChild(categoryWork);
    });
};

// > Fonction pour ajouter un nouveau projet

// Fonction pour avoir une photo
function getNewPhoto() {

    // Constante pour recuperer le premier fichier selectionne, "this" fait reference au btn "input type : file"
    const selectedNewPhoto = btnAddFile.files[0];

    // Taille requise, 4mo
    const sizeFileMax = 4 * 1024 * 1024;

    //Type de fichier requis
    const typeFile = ["image/jpg", "image/png"];

    // Verification de la taille de la photo
    if(selectedNewPhoto.size > sizeFileMax) {
        alert("Votre fichier dépasse 4 Mo.")
        // Verification du type de fichier
    } else if(!typeFile.includes(selectedNewPhoto.type)) {
        alert("Seuls les fichiers de type jpg ou png sont acceptés.")
    } else {
        // Cacher le contenu de la photo
        contentAddPhoto.style.display = "none";

    // Creer une nouvelle image
    let newPhoto = document.createElement("img");

    // Ajouter la source de la photo en utilisant l'url creee
    newPhoto.src = URL.createObjectURL(selectedNewPhoto);
    // Ajouter une classe et changer la taille de l'image pour la mettre dans l'element parent
    newPhoto.classList.add("new-photo");
    newPhoto.style.height = "169px";
    // Ajouter une nouvelle image a la <div> previewNewPhoto
    previewNewPhoto.appendChild(newPhoto);

    newPhoto.addEventListener("click", () => {
        // Changer la photo en cliquant dessus
        btnAddFile.click();
        // Appeler la fonction qui reinitialise la photo dans la nouvelle modale
        resetAddModal();
    });
    };
};

// Bouton de validation inactif 
function setBtnState(disabled) {
    btnValidAddModal.disabled = disabled;
    btnValidAddModal.style.cursor = disabled ? "not-allowed" : "pointer";
    btnValidAddModal.style.backgroundColor = disabled ? "grey" : "#1D6154";
};
setBtnState(true);

// Changer l'etat du bouton si tout est reuni pour ajouter un fichier
function toggleSubmitBtn() {
    const photoAdded = document.querySelector(".new-photo");

    // Verifier si le titre, la categorie et la photo remplissent les conditions pour changer l'etat du bouton
    if (!(titleAddModal.value && categorieAddModal.value && photoAdded !== null)) {
        // Laisser le bouton en inactif
        setBtnState(true);
    } else {
        // Activer le bouton si toutes les conditions sont reunies
       setBtnState(false);
    };
};

// > Fonction pour réinitialiser le contenu de la modale n°2

function resetAddModal () {
    // Reinitialise le titre, categorie, l'image et le bouton d'ajout
    previewNewPhoto.innerHTML = "";
    titleAddModal.value = "";
    categorieAddModal.value = "";
    btnAddFile.value = "";

    contentAddPhoto.style.display = "flex";
    
    // Reinitialise le bouton de validation
    toggleSubmitBtn();
};



//> Fonction pour envoyer la photo à l'API
function postNewPhoto () {
    // Créer l'objet formData pour envoyer le formulaire à la 2ème modale
    const formData = new FormData();

    // Ajouter les valeurs au formData
    formData.append("title", titleAddModal.value);
    formData.append("category", categorieAddModal.value);
    formData.append("image", btnAddFile.files[0])

    // console.log("Données envoyées:", {
        // title: titleAddModal.value,
        // category : categorieAddModal.value,
        // image: btnAddFile.files[0]
        // });

    // Envoyer à l'API
    fetch("http://localhost:5678/api/works", {
        method: "POST", 
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw Error(`${response.status}`)
        }
        return response.json();

    })
    .then((galleryData) => {
        // Mise à jour de la gallerie et fermeture de la modale
        works.push(galleryData);
        createWorks();
        closeModal(null);
    })
    .catch(error => alert("Erreur : " + error));
};

//* LES EVENTLISTENER

// EventListener pour envoyer le nouveau formulaire
formPhoto.addEventListener("submit", function (e) {
    e.preventDefault();
    postNewPhoto();
});

// EventListener pour récupérer la photo des fichiers de l'ordinateur
btnAddFile.addEventListener("change", getNewPhoto);

// EventListener pour désactiver le bouton de validation de la 2ème modale
titleAddModal.addEventListener("input", toggleSubmitBtn);
categorieAddModal.addEventListener("input", toggleSubmitBtn);
btnAddFile.addEventListener("change", toggleSubmitBtn);