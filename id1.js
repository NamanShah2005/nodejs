import express from "express"
import path from "path"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"

const hostname = "127.0.0.1"
const port = 3000

mongoose
    .connect("mongodb://127.0.0.1:27017", {dbName: "backend",})
    .then(() => {console.log("Connected Successfully")
}).catch((e) => console.log(e))

const schema = new mongoose.Schema({
    Name : String,
    Email : String,
})

const msg = mongoose.model("login" , schema)

let t = {
    name: ["Naman", "Bhavya"],
    Course: ["Data", "Machine"]
}




// console.log(t)
// console.log(t["name"].length)

const app = express()

app.use(express.static(path.join(path.resolve(), "public")))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.render("index.ejs")
    console.log(req.cookies)
    
    
    
})


app.post("/", (req, res) => {
    let r = req.body
    console.log(r)
    console.log(t)
    for (let i = 0; i < t["name"].length; i++) {
        if (r["Name"] == t["name"][i] && r["Course"] == t["Course"][i]) {
            res.render("androidProject.ejs")
        }
    }
})





app.post("/bb" , (req,res) => {
    let p = req.body
    t["name"].push(p["Name"])
    t["Course"].push(p["Course"])
    
    
    
    
    res.cookie("token" , "iamin" , {
        httpOnly:true , expires : new Date(Date.now() + 10*1000)
    })
    
    // res.redirect("/withlogform.html")
    res.render("index.ejs")





    msg.create({Name : p["Name"] , Email : p["Email"]})
    // console.log(msg.Name)
    // console.log(msg.find({Name : "Naman"}).length)


})




app.listen(port, hostname, () => {
    console.log(`The server is working on http://${hostname}:${port}/`)
})