const settingsBox = document.querySelector(".settings-box ")
const settingsToggle = settingsBox.querySelector(".toggle")
const colors = settingsBox.querySelectorAll(".color-box li")
const backgroundController = settingsBox.querySelector(".background-box input")
const bulletsController = settingsBox.querySelector(".bullets-box input")
const resetButton = settingsBox.querySelector(".reset button")
const bullets = document.querySelectorAll(".bullets span")
const landing = document.querySelector(".landing")
const navButton = document.querySelector(".landing nav button")
const skillsContainer = document.querySelector(".skills")
const skills = document.querySelectorAll(".skills .box span")
const gallery = document.querySelector(".gallery .img")
const images = gallery.querySelectorAll("img")
// ###################################### remove comments
// const interval = 10000
const interval = 10000000
const imagesArray = [
    "0.jpg",
    "1.jpg",
    "2.jpg",
    "3.jpg",
]
// general functions

function outsideClick(target, desiredElement, callback) {
    if (target && desiredElement) {
        if (!desiredElement.contains(target)) {
            if (callback) callback()
        }
    }
    return !desiredElement.contains(target)
}

// on load to set theme color from localstorage
const localSttorageColor = localStorage.getItem("color")
if (localSttorageColor) {
    document.documentElement.style.setProperty("--main-color", localSttorageColor)
    const children = colors[0].parentElement.children;
    for (let i = 0; i < children.length; i++) {
        children[i].classList.remove("active");
        if (children[i].getAttribute("data-color") === localSttorageColor) {
            children[i].classList.add("active");
        }
    }
}

// changing theme color
colors.forEach(color => color.addEventListener("click", function (e) {
    const colorValue = color.getAttribute("data-color")
    document.documentElement.style.setProperty("--main-color", colorValue)
    color.parentElement.querySelectorAll(".active").forEach(element => element.classList.remove("active"))
    color.classList.add("active")
    localStorage.setItem("color", colorValue)
}))
settingsToggle.addEventListener("click", function (e) {
    settingsToggle.childNodes[1].classList.toggle("fa-spin")
    this.parentNode.classList.toggle("open")
})

// for bullets
bullets.forEach(element => element.addEventListener("click", function () {
    let target = document.getElementById(element.querySelector("p").textContent)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}))
const localSttorageIsVisibleBullets = localStorage.getItem("isVisibleBullets")
if (localSttorageIsVisibleBullets === "false") {
    bullets[0].parentElement.classList.toggle("hide")
    bulletsController.checked = false
}
bulletsController.addEventListener("click", function () {
    localStorage.setItem("isVisibleBullets", bulletsController.checked)
    bullets[0].parentElement.classList.toggle("hide")
})
// reset localestorage button
resetButton.addEventListener("click", function () {
    localStorage.clear()
    window.location.reload()
})

// for navbar toggle
let ul = document.querySelector(".landing header nav ul")
function navOutsideClick(e) {
    if (outsideClick(e.target, navButton) && ul.classList.contains("open")) {
        outsideClick(e.target, ul, () => ul.classList.toggle("open"))
    }
}

document.body.addEventListener("click", navOutsideClick, true)
navButton.addEventListener("click", function () {
    ul.classList.toggle("open")
})

// changing landing section image background
function changeBackgroundImage() {
    landing.style.backgroundImage = `url("../images/${imagesArray[Math.floor(Math.random() * imagesArray.length)]}")`
}
let imageInterval

if (localStorage.getItem("isRandomBackground") === "false") {
    clearInterval(imageInterval)
    backgroundController.removeAttribute("checked")
} else {
    imageInterval = setInterval(() => changeBackgroundImage(), interval)
}

backgroundController.addEventListener("change", (e) => {
    localStorage.setItem("isRandomBackground", e.target.checked)
    if (e.target.checked) {
        imageInterval = setInterval(() => changeBackgroundImage(), interval)
    } else {
        clearInterval(imageInterval)
    }
})


let prevScrollPos = window.scrollY;
function sticky() {
    let currentScrollPos = window.scrollY;
    if ((Math.abs(prevScrollPos - currentScrollPos) > 10)) {
        let header = document.querySelector("header");
        if (currentScrollPos > 600 && (prevScrollPos > currentScrollPos)) {
            header.classList.add("sticky")
        } else {
            header.classList.remove("sticky")
        }
        prevScrollPos = currentScrollPos;
    }
}



// for skills

function stylizeSkillBox(skills) {
    const styleElement = document.createElement('style');
    skills.forEach((skill, i) => {
        let progress = skill.dataset.progress
        styleElement.textContent += `
            .skills .box:nth-of-type(${i + 1})  span::before {
                width: ${progress}%;
            }
            `;
    });
    document.head.appendChild(styleElement);
}

function skillsScroll(skills) {
    let skillsTop = skillsContainer.offsetTop
    let windowtop = this.scrollY
    let windowHeight = this.innerHeight
    let condition = (windowtop + windowHeight / 5) > skillsTop
    let arr = []
    skills.forEach(skill => arr.push(window.getComputedStyle(skill, '::before').width.split("px")[0]))
    if (condition && arr.includes("0")) {
        stylizeSkillBox(skills)
    }
}
window.onscroll = () => { skillsScroll(skills); sticky() }

// for gallery

function overlayOutsideClick(e) {
    let overlay = document.querySelector(".gallery-overlay")
    let div = document.querySelector(".gallery-overlay > div")
    return outsideClick(e.target, div, () => overlay.remove())
}
images.forEach(img => img.addEventListener("click", () => {
    let old = document.body.querySelector(".galley-overlay")
    if (old) old.remove()
    let overlay = document.createElement("div")
    let imgDiv = document.createElement("div")
    let div = document.createElement("div")
    let button = document.createElement("button")
    button.addEventListener("click", () => {
        overlay.remove()
        overlay.removeEventListener('click', overlayOutsideClick);
    })
    overlay.className = "gallery-overlay"
    button.textContent = "X"

    if (img.alt) {
        let h4 = document.createElement("h4")
        h4.textContent = img.alt
        div.append(h4)
    }
    div.append(button)
    imgDiv.append(img.cloneNode())
    div.append(imgDiv)
    overlay.append(div)
    document.body.appendChild(overlay)
    overlay.addEventListener('click', overlayOutsideClick);
}))

