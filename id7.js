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
    Name: String,
    Password: String
})

const msg = mongoose.model("msg", schema)

const app = express()

app.use(express.static(path.join(path.resolve(), "public")))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const isAuthen = async( req , res , next ) => {
    let token1 = req.cookies.token

    if(token1){
        const decoded = jwt.verify(token1 , "Private")
        req.user = await msg.findById(decoded)
        console.log(req.user.Name)
        next()
    }

    else{
        res.render("frontEndLogin.ejs")
    }
}

app.get("/", isAuthen ,async(req, res) => {
    res.render("androidProject.ejs" , {
        Name : req.user.Name
    })
})

app.post("/register", async(req, res) => {
    let { Name, Password } = req.body
    const hashedPassword = await bcrypt.hash(Password , 10)

    msg.create({
        Name,
        Password : hashedPassword
    })
    res.redirect("/")
})

app.post("/login", async(req, res) => {
    let { Name, Password } = req.body
    // console.log(Name , Password)

    let user = await msg.findOne({ Name })
    // console.log(user.Password)

    if (!user) {
        res.render("frontendregister.ejs")
    }

    else {
        const check = await bcrypt.compare(Password , user.Password)
        if (!check) {
            res.render("frontEndLogin.ejs" , {
                Name : user.Name
            })
        }

        else {
            let token = await jwt.sign({_id : user._id} , "Private")
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

app.listen(port, hostname, () => {
    console.log(`The server is working at http://${hostname}:${port}/`)
})