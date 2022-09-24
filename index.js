// relations to DOM
const mainEl = document.getElementsByTagName("main")[0]
const footerEl = document.getElementsByTagName("footer")[0]
const eyeDropperEl = document.getElementById("eye-dropper")
const modeEl = document.getElementById("mode")
const getColorBtn = document.getElementById("get-color")

async function handleGetColor() {
  try{
    mainEl.innerHTML = ""
    displaySpinner()
    const res = await fetch(`https://www.thecolorapi.com/scheme?hex=${eyeDropperEl.value.substring(1)}&format=json&mode=${modeEl.value}&count=${count}`)
    const data = await res.json()
    removeSpinner()
    renderColors(data.colors)
  } catch (err) {
    console.error(err)
    removeSpinner()
    mainEl.innerHTML = `
        <div class = "error-container"
            <p class = "error-message">Something went wrong!😿</br>Please try again later.</p>
        </div>
    `   
  }
}

const count = 5;

function renderColors(data) {
  let html = ""
  data.forEach(color => {html += `
  <div class = "color-container"
    style = "background-color:${color.hex.value}">
      <div class = "color-value-container">
        <p class = "color-value">${color.hex.value}</p>
        <p class = "color-value">${color.rgb.value}</p>
      </div>
    </div>
  `
    mainEl.innerHTML = html
  })
}

function displaySpinner() {
  mainEl.classList.add("loading")
}

function removeSpinner() {
  mainEl.classList.remove("loading")
}

async function copyToClipboard(e) {
  try{
    await navigator.clipboard.writeText(e.target.textContent)
    footerEl.innerHTML = `
      <div class = "alert-box">
        <p>Copied to clipboard!</p>
      </div>
      `
  setTimeout(() => footerEl.innerHTML = "", 2000)
  } catch(err) {
      console.error("Failed to copy: " + err)
      footerEl.innerHTML = `
        <div class = "alert-box">
          <p>Failed to copy. Please verify clipboard access permission.</p>
        </div>
      `
    setTimeout(() => footerEl.innerHTML = "", 2000)
  }
}

getColorBtn.addEventListener("click", ()=>{
  handleGetColor().then(() => {
    const colorCodeArray = Array.from(document.querySelectorAll(".color-value"))
    for(element of colorCodeArray){
      element.addEventListener("click", (e)=>{
      copyToClipboard(e)
      })
    }
  })
})