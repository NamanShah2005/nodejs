import express from "express"
import path from "path"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const hostname = "127.0.0.1"
const port = 2000

mongoose.connect("mongodb://127.0.0.1:27017", { dbName: "Backendd" }).then(() => {
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

const isAuthen = async(req , res , next) => {
    let token1 = req.cookies.token

    if(token1) {
        const decoded = jwt.verify(token1 , "private")
        req.user = await msg.findById(decoded)
        next()
    }

    else{
        req.user = 
        res.render("frontEndLogin.ejs")
    }
}

app.get("/", isAuthen , (req, res) => {
    res.render("androidProject.ejs" ,{
        Name : req.user.Name
    })
})

app.post("/login", async(req, res) => {

    let r = req.body
    // console.log(r)
    let {Name, Password} = req.body
    // console.log(Password)

    let user = await msg.findOne({ Name })
    // console.log(user.Password)

    if (!user) {
        res.render("frontendregister.ejs")
    }

    else {
        const check = await bcrypt.compare(Password , user.Password)
        // console.log(check)

        if (!check) {
            // res.render("frontendregister.ejs")
            res.redirect("/")
        }

        else {
            let token = await jwt.sign({_id : user._id} , "private")
            res.cookie("token" , token ,{
                httpOnly : true , expires : new Date(Date.now() + 10*1000)
            })
            // res.render("androidProject.ejs", {
            //     Name: user.Name
            // })
            res.redirect("/")
        }
    }
})

app.post("/register", async(req, res) => {

    let { Name, Password } = req.body
    // console.log(Name , Password)

    const hashedPassword = await bcrypt.hash(Password , 10)

    msg.create({
        Name,
        Password : hashedPassword
    })

    res.render("frontEndLogin.ejs")
})

app.post("/bs", (req, res) => {
    res.cookie("token" , null , {
        httpOnly : true , expires : new Date(Date.now())
    })
    res.redirect("/")
    // res.render("frontEndLogin.ejs")
})

app.listen(port, hostname, () => {
    console.log(`The server is working at http://${hostname}:${port}/`)
})