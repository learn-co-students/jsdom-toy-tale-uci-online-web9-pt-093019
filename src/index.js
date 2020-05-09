let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  toyFormContainer.addEventListener('submit', (event) => {
    event.preventDefault()
    
    const formData = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    }

    const toyConfigObj = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 
        'Accept': 'application/json'},
      body: JSON.stringify(formData)
    }

    fetch('http://localhost:3000/toys', toyConfigObj)
      .then(resp => resp.json())
      .then(object => createCard(object))
  })
  getToys()
});

function getToys() {
  fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(json => createToyCards(json))
}

function createToyCards(json) {
  for (toy of json) {
  createCard(toy)
  }
}

function createCard(toy) {
    const toyCollection = document.getElementById('toy-collection')

    const cardDiv = document.createElement('div')
    cardDiv.classList.add('card')
    cardDiv.id = toy.id

    const toyName = document.createElement('h2')
    toyName.innerText = toy.name
    cardDiv.appendChild(toyName)

    const toyImg = document.createElement('img')
    toyImg.src = toy.image
    toyImg.classList += 'toy-avatar'
    cardDiv.appendChild(toyImg)

    const toyLikes = document.createElement('p')
    toyLikes.innerText=`${toy.likes} Likes`
    cardDiv.appendChild(toyLikes)

    const likeBtn = document.createElement('button')
    likeBtn.classList += 'like-btn'
    likeBtn.innerText = 'Like <3'
    likeBtn.id = toy.id
    cardDiv.appendChild(likeBtn)
    toyCollection.appendChild(cardDiv)

    likeBtn.addEventListener('click', toyLike)
}

function toyLike(event) {
  const toyID = event.target.id
  const toyCard = document.getElementById(toyID)
  const toyLikeElement = toyCard.querySelector('p')
  let toyLikes = parseInt(toyLikeElement.innerText)
  toyLikes += 1

  toyLikeElement.innerText = `${toyLikes} Likes`

  saveLike(toyID, toyLikes)
}

function saveLike(toyID, toyLikes) {
  const likeObj = {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'likes': toyLikes
    })
  }

  fetch(`http://localhost:3000/toys/${toyID}`, likeObj)
    .then(resp => resp.json())
}