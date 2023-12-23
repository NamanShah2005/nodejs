import express from "express"
import path from "path"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"

const hostname = "127.0.0.1"
const port = 3000

mongoose.connect("mongodb://127.0.0.1:27017", { dbName: "backend" }).then(() => { console.log("Database Connected") }).catch((e) => {
    console.log(e)
})

const schema = mongoose.Schema({
    Name: String,
    Email: String,
    Age : String,
    Gender : String,
    Course : String,
    Date : String
})


const msg = mongoose.model("Naman123", schema)

const app = express()

app.use(express.static(path.join(path.resolve(), "public")))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


const isAuthen = async (req, res, next) => {
    let token1 = req.cookies.token
    if (token1) {
        const decoded = jwt.verify(token1, "userPrivate")
        req.user = await msg.findById(decoded._id)
        next()
    }
    else {
        res.render("index.ejs")
    }
}


app.get("/", isAuthen, (req, res) => {
    res.render("androidProject.ejs", {
        Name: req.user.Name
    })
})


app.post("/b", async (req, res) => {

    let r = req.body
    const { Name , Email } = req.body

    let user = await msg.findOne({Email , Name})

    if (!user) {
        res.render("idks.ejs")
    }
    else{
        const token = jwt.sign({ _id: user._id }, "userPrivate")
        res.cookie("token", token, {
            httpOnly: true, expires: new Date(Date.now() + 10 * 1000)
        })

        res.redirect("/")
    }
})

app.post("/bsp" , (req,res) => {
    res.render("idks.ejs")
})

app.post("/bs", (req, res) => {
    res.cookie("token", "null", {
        httpOnly: true, expires: new Date(Date.now())
    })
    res.redirect("/")
})


app.post("/bb", (req, res) => {
    let r = req.body
    console.log(r)
    msg.create({
        Name: r["Name"],
        Email: r["Email"],
        Age : r["Age"],
        Gender : r["Gender"],
        Course : r["Course"],
        Date : r["Email"]
    })
    res.render("index.ejs")
})


app.listen(port, hostname, () => {
    console.log(`The server has been created on http://${hostname}:${port}/`)
})