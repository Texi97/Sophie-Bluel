

// Variables
const gallery = document.querySelector(".gallery");
let works = [];
let categories = [];

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
    createWorks();
})
.catch(error => alert("Erreur : " + error))

//Fonction de creer un nouveau projet
function createWorks(categoryId = null) {

//Filtrer les categories des projets
const displayWorks = categoryId ? works.filter(work => work.categoryId === categoryId) : works;

//Ajouter des elements pour chaque projet
displayWorks.forEach(work => {
    //Creer une div pour chaque work, chaque div contient un id stipulant le n° de projet "work-n°"
    const workDiv = document.createElement("div");
    workDiv.setAttribute("id", `work-${work.id}`);
    //Creer un element img pour afficher l'image du projet
    const workImg = document.createElement("img");
    workImg.src = work.imageUrl;
    workImg.setAttribute("alt", work.title);
    //Creer un element <caption> pour afficher le titre du projet
    const workTitle = document.createElement("caption");
    workTitle.innerText = work.title;
    //Ajouter les elements a la galerie. Des div dans .gallery, work.img et work.title dans la div
    gallery.appendChild(workDiv);
    workDiv.appendChild(workImg);
    workDiv.appendChild(workTitle);
})};

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

//Ajouter des categories de filtres pour ensuite filtrer les projets
function createFilter(){
    categories.unshift({id: 0, name: "Tous"});

    const categoriesFilter = document.createElement("div");
    categoriesFilter.classList.add("categories");
    portfolio.insertBefore
}