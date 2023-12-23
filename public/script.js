let s = document.getElementById("dd")
let i = document.getElementById("ddd")
let h3 = document.getElementById("h3")

dd.addEventListener("click" , sdf)

function sdf() {
    let y = i.value
    // console.log(y.count("n"))
    h3.innerHTML = y + h3.innerHTML
    h3.style.display = "block"
}