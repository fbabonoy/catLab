import * as Carousel from "./Carousel.js";
import { AxiousObj } from "./axios.js"


// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_N544Y2FQYikguEIiktiqTdX3oL9S1xpjRkmWQfS4u3GqoqwCAHREgsZFJYFuL5oO";
let link = `https://api.thecatapi.com/v1/breeds`;
let selection = ""
let catInfo = `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${selection}&api_key=${API_KEY}`


//1

async function fetchLoad(link, loadCall) {
  try {
    let data = await fetch(link)
    let json = await data.json()
    loadCall(json)
  } catch (e) {
    console.log(e);
  }
}

function loadWindow(data = []) {
  let fragment = document.createDocumentFragment()


  for (let cat of data) {
    let option = document.createElement("option")
    option.value = cat.id
    option.textContent = cat.name
    fragment.appendChild(option)

  }
  selection = data[0].id


  // fetchLoad(catInfo, createCarousel)
  axious1.axiousGet(`/images/search?limit=10&breed_ids=${selection}`, createCarousel)
  breedSelect.appendChild(fragment)
}

// fetchLoad(link,loadWindow)

// 2

function createCarousel(data) {
  Carousel.clear()

  let info = document.createElement("p")

  if (data < 1) {
                
    data = [{
      breeds: [{name: "missy",
          description:""
      }],
      id: "notFound",
      url:"https://27bslash6.com/images/Missy_poster_07.jpg"}
      ]

  }

  for (let cat of data) {
    let image = Carousel.createCarouselItem(cat.url, cat.breeds[0].name, cat.id)
    Carousel.appendCarousel(image)
    if (cat.breeds[0]) {
      info.textContent = cat.breeds[0].description
    }

  }
  infoDump.appendChild(info)
  Carousel.start()
}

//4
let axious1 = new AxiousObj('https://api.thecatapi.com/v1/', API_KEY)
axious1.axiousGet("/breeds", loadWindow)


breedSelect.addEventListener("change", (e) => {
  selection = e.target.value
  // fetchLoad(catInfo, createCarousel)

  axious1.axiousGet(`/images/search?limit=10&breed_ids=${selection}`, createCarousel)

})


//8
let favId = { "unPP08xOZ": "" }

export async function favourite(imgId) {

  let rawBody = {
    "image_id": imgId,
    "sub_id": "user-1"
  }
  console.log(imgId);

  if (!favId[imgId]) {
    let favorite = await axious1.axiousPost("/favourites", rawBody)
    console.log(favorite);
    favId[imgId] = favorite
  } else {
    await axious1.axiousDel(`/favourites/` + favId[imgId])
    delete favId[imgId];
  }
}

//9

getFavouritesBtn.addEventListener("click", (e) => {
  for (let id in favId) {
    axious1.axiousGet(`/images/${id}`, favCarousel)
  }
})


function favCarousel(data) {
  Carousel.clear()

  infoDump.innerHTML = ""
  let info = document.createElement("p")

  let image = Carousel.createCarouselItem(data.url)
  Carousel.appendCarousel(image)
  if (data.breeds[0]) {
    info.textContent = data.breeds[0].description
  }

  infoDump.appendChild(info)
  Carousel.start()
}
/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
