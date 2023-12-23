import express from "express"
import path from "path"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"

const hostname = "127.0.0.1"
const port = 3000

mongoose.connect("mongodb://127.0.0.1:27017", { dbName: "backend" }).then(() => {
    console.log("Database connected succesfully")
}).catch((e) => {
    console.log(e)
})

const schema = new mongoose.Schema({
    Name: String,
    Email: String
})

const msg = mongoose.model("msg", schema)

const app = express()

app.use(express.static(path.join(path.resolve(), "public")))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

let authen = async(req,res,next) => {
    let token1 = req.cookies.token
    console.log(token1)

    if(token1) {
        const decoded = jwt.verify(token1 , "private")
        req.user = await msg.findById(decoded)
        console.log(req.user.Name)
        next()
    }

    else{
        res.render("index.ejs")
    }
}

app.get("/", authen ,(req, res) => {
    res.render("androidProject.ejs" , {
        Name : req.user.Name
    })
})

app.post("/b", async(req, res) => {

    let r = req.body
    let {Name , Email} = req.body

    let user = await msg.findOne({ Name, Email })

    if (!user) {
        res.render("idks.ejs")
    }

    else {
        let token = jwt.sign({_id : user._id} , "private")
        console.log(token)
        res.cookie("token", token , {
            httpOnly: true, expires: new Date(Date.now() + 10 * 1000)
        })


        res.redirect("/")

    }
})

app.post("/bs", (req, res) => {
    res.cookie("token", null, {
        httpOnly: true, expires: new Date(Date.now())
    })

    // res.render("index.ejs")
    res.redirect("/")
})

// app.post("/bsp" , (req,res) => {
//     msg.deleteOne({Name : "Naman Shah"})
//     res.render("androidProject.ejs" , {
//         Name : "Naman"
//     })
// })

app.post("/bb", (req, res) => {
    let { Name, Email } = req.body

    msg.create({
        Name,
        Email
    })

    res.render("index.ejs")
})

app.listen(port, hostname, () => {
    console.log(`The server is working on http://${hostname}:${port}/`)
})