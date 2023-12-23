import express from "express"
import path from "path"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const hostname = "127.0.0.1"
const port = 3000

mongoose.connect("mongodb://127.0.0.1:27017", { dbName: "backend" }).then(() => {
    console.log("Database connected")
}).catch((e) => {
    console.log(e)
})

const schema = mongoose.Schema({
    Name : String,
    Email : String,
    Password : String
})

const msg = mongoose.model("msg", schema)

const app = express()

app.use(express.static(path.join(path.resolve(), "public")))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

let isAuthen = async (req, res, next) => {

    let token1 = req.cookies.token

    app.post("/bsp", (req, res) => {
        let token1 = req.cookies.token
        const decoded = jwt.verify(token1, "private")
        msg.deleteOne({ _id: decoded }).then(() => {
            console.log("deleted")
        }).catch((e) => {
            console.log(e)
        })
        res.render("index.ejs")
    })

    if (token1) {
        const decoded = jwt.verify(token1, "private")
        req.user = await msg.findById(decoded)
        // console.log(req.user.Name)
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
    let {Email , Password , Name} = req.body
    const users = await msg.findOne({Email})
    
    if (!users) {
        res.render("idks.ejs")
    }
    
    else {
        const check = await bcrypt.compare(Password , users.Password)

        if (!check) {
            res.render("index.ejs", {
                Email : Email,
                message: "incorrect Password"
            })
        }

        else {
            let token = jwt.sign({ _id: users._id }, "private")
            res.cookie("token", token, {
                httpOnly: true, expires: new Date(Date.now() + 10 * 1000)
            })
            res.redirect("/")
        }
    }
})

app.post("/bs", (req, res) => {
    res.cookie("token", null, {
        httpOnly: true, expires: new Date(Date.now())
    })
    res.redirect("/")
})

app.post("/bb", async (req, res) => {
    let {Email , Password , Name} = req.body
    let y = await msg.findOne({ Email, Name})
    if (y) {
        console.log("Already a member")
        res.render("idks.ejs" ,{
            message : "The user already exist"
        })
    }

    else {
        const hashedPassword = await bcrypt.hash(Password , 10)
        msg.create({
            Email,
            Password : hashedPassword,
            Name
        })
        res.render("index.ejs")
    }
})

app.listen(port, hostname, () => {
    console.log(`The server is working at http://${hostname}:${port}/`)
})