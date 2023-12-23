import express from "express"
import path from "path"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"

const hostname = "127.0.0.1"
const port = 3000

mongoose.connect("mongodb://127.0.0.1:27017" , {dbName : "backend"}).then(() => {
    console.log("Server created successfully")
}).catch((e) => {
    console.log(e)
})

const schema = mongoose.Schema({
    Name : String,
    Email : String
})

const msg = mongoose.model("naman" , schema)

const app = express()

app.use(express.static(path.join(path.resolve() , "public")))
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

const isAuthen = (req , res , next) => {
    let token = req.cookies.token

    if(token) {
        next();
    }

    else{
        res.render("index.ejs")
    }
}

app.get("/" , isAuthen , (req , res) => {
    res.render("androidProject.ejs")
})

app.post("/b" , (req , res) => {
    res.cookie("token" , "Yes" , {
        httpOnly : true , expires : new Date(Date.now() + 10*1000)
    })

    res.redirect("/")
})

app.post("/bs" , (req , res) => {
    res.cookie("token" , null , {
        httpOnly : true , expires : new Date(Date.now())
    })

    res.redirect("/")
})

app.post("/bb" , (req,res) => {
    res.cookie("token" , null , {
        httpOnly : true , expires : new Date(Date.now())
    })

    res.redirect("/")

})

app.listen(port , hostname , () => {
    console.log(`The server is working on http://${hostname}:${port}/`)
})