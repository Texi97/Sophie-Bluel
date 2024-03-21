// > VARIABLES

const gallery = document.querySelector(".gallery");
let works = [];
let categories = [];
let createWorksCalled = false; //Variable qui suit l'etat de createWorks()
const ModalContentGallery = document.querySelector(".gallery-list");
const messagePhotoDeleted = document.querySelector(".message-deleted");

const firstModal = document.querySelector(".modal-deleted");
const addModal = document.querySelector(".modal-add");

const btnValidAddModal = document.getElementById("btn-valid");
const formPhoto = document.querySelector(".form-photo");

const btnAddFile = document.getElementById("file");
const titleAddModal = document.getElementById("title-photo");
const categorieAddModal = document.getElementById("categorie-photo");

const previewNewPhoto = document.querySelector(".preview");
/**Access to photo  add content */
const contentAddPhoto = document.querySelector(".content-add-photo");





// > Récupérer de manière dynamique les projets

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

// > Récupérer de manière dynamique les catégories

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

// * GALLERIE
// > Fonction pour créer un nouveau projet

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

// * FILTRES
// > Ajouter des catégories de filtre pour filtrer les projets

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

// > Promesse pour attendre la création des catégories avant de masquer les éléments

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

// * UTILISATEUR CONNECTÉ
// > Conditions pour afficher ou masquer des éléments lorsque l'utilisateur est connecté

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

    document.addEventListener("DOMContentLoaded", () => {
        const token = sessionStorage.getItem("token");
        const loginLink = document.getElementById("loginLink");

        if (token) {
            // Utilisateur connecte
            const logoutLink = document.createElement("a");
            logoutLink.innerText = "logout";
            logoutLink.href = "javascript:void(0);";
            logoutLink.addEventListener("click", () => {
                // Deconnexion : Supprime le token du sessionStorage
                sessionStorage.removeItem("token");
                // Rediriger vers la page de connexion
                location.href = "login.html";
            });

            // Remplacer le lien "login" par "logout"
            loginLink.parentNode.replaceChild(logoutLink, loginLink);
        } else {
            // Utilisateur non connecté
            loginLink.innerText = "login";
            loginLink.href = "login.html"; // Rediriger vers la page de connexion
        }
    });

});

let modal = null

// * MODALE N°1
// > Fonction pour ouvrir la 1ère modale

const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"))
    target.style.display = null;
    target.removeAttribute("aria-hidden")
    target.setAttribute("aria-modal", "true")
    modal = target
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-close-modal").addEventListener("click", closeModal)
    modal.querySelector(".js-close-stop").addEventListener("click", stopPropagation)

    displayWorksFirstModal();
}

// > Fonction pour fermer la 1ère modale

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-close-modal").removeEventListener("click", closeModal)
    modal.querySelector(".js-close-stop").removeEventListener("click", stopPropagation)
    modal = null
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

function deleteWork(id) {
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
        
        // Afficher le message pendatn 1.5 secondes
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

function openAddModal (event) {
    if (event) {
    event.preventDefault();
    }
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


        /**POST API */

/**Function to POST a photo to the API */
function postNewPhoto () {
    /**Creating a formData object to send form data to the add modal */
    const formData = new FormData();

    /**Adding values ​​to formData */
    formData.append("title", titleAddModal.value);
    formData.append("category", categorieAddModal.value);
    formData.append("image", btnAddFile.files[0])

    // console.log("Données envoyées:", {
    //     title: titleAddModal.value,
    //     category : categorieAddModal.value,
    //     image: btnAddFile.files[0]
    // });

    /**Sending to the API */
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
        /**Updating the gallery and closing the modal */
        works.push(galleryData);
        createWorks();
        closeModal();
    })
    .catch(error => alert("Erreur : " + error));
};

/* ****************************** */
/* DECLARATION OF EVENT LISTENERS */
/* ****************************** */

/**EventListener for sending the new form */
formPhoto.addEventListener("submit", function (e) {
    e.preventDefault();
    postNewPhoto();
});

/**EventListener to recover the photo from the computer files */
btnAddFile.addEventListener("change", getNewPhoto);

/**EventListener to disable the validation button of the add modal */
titleAddModal.addEventListener("input", toggleSubmitBtn);
categorieAddModal.addEventListener("input", toggleSubmitBtn);
btnAddFile.addEventListener("change", toggleSubmitBtn);

/***************************************************************************** */