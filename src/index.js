let addToy = false;

document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {  
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const submitNewToyButton = document.getElementsByClassName("add-toy-form")[0]

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys()
  submitNewToyButton.addEventListener('submit', addNewToy)  
}

// fetch and display toys functions 

function fetchToys () {
  const toyUrl = "http://localhost:3000/toys" 
  fetch(toyUrl).then(resp => resp.json()).then(json => parseToys(json));  
}

function parseToys(json) {
  const toyContainter = document.getElementById("toy-collection")

  json.forEach(function(object){
    const newToy = document.createElement("div")
    newToy.setAttribute('class', 'card')

    buildCard(newToy, object)
    
    const likeButton = newToy.children[3]
    likeButton.addEventListener('click', addLike)
    
    toyContainter.appendChild(newToy)
  });  
}

function buildCard(card, object) {
  const name = document.createElement('h2')
  const img = document.createElement('img')
  const likes = document.createElement('p')
  const likeButton = document.createElement('button')  
  const id = document.createElement('p')
  
  name.innerText = object.name 
  img.src = object.image 
  img.setAttribute('class', 'toy-avatar')
  likes.innerText = object.likes 
  likeButton.setAttribute('class', 'like-btn')
  likeButton.innerText = 'Like'
  id.style.visibility = "hidden"
  id.innerText = object.id 

  card.appendChild(name)
  card.appendChild(img)
  card.appendChild(likes)
  card.appendChild(likeButton)
  card.appendChild(id)

  return card  
}

// add new toy functions 

function addNewToy(event) {
  event.preventDefault()

  const newToyName = document.getElementsByClassName("add-toy-form")[0].name.value
  const newToyImg = document.getElementsByClassName("add-toy-form")[0].image.value
  document.getElementsByClassName("add-toy-form")[0].name.value = ""
  document.getElementsByClassName("add-toy-form")[0].image.value = ""  

  const formData = {
    "name": newToyName,
    "image": newToyImg,
    "likes": 0
  }
  const configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
  },
  body: JSON.stringify(formData)
  } 

  return fetch("http://localhost:3000/toys", configObj).then(function(resp) {
    return resp.json()
  }).then(function(object) {
    jsonArray = [object]
    parseToys(jsonArray)
  }).catch(function(error) {
    alert("Error")
    console.log(error.message)
  })
}

// add likes 

function addLike(event) {
  let updatedLikes = event.target.parentElement.getElementsByTagName('p')[0].innerText
  const id = event.target.parentElement.getElementsByTagName('p')[1].textContent
  updatedLikes++ 

  const formData = {
        "likes": updatedLikes
  }
  const configObj = {
    method: "PATCH",
    headers: 
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(formData)
  }

  return fetch(`http://localhost:3000/toys/${id}`, configObj).then(function(resp) {
    return resp.json()
  }).then(function(object) {
    updateCardByObject(object)
  }).catch(function(error) {
    alert("Error")
    console.log(error.message)
  })
}

function updateCardByObject(obj) {
  const cardsList = document.getElementById("toy-collection").children 

  for(let i = 0; i < cardsList.length; i++) {
    const current = cardsList[i]
    currentId = current.getElementsByTagName('p')[1].textContent
    if(currentId == obj.id){
      current.getElementsByTagName('p')[0].textContent = obj.likes 
    }
  } 
}