const express = require("express")
const { default: mongoose } = require("mongoose")
const authRoute = require("./routes/auth/authRoute")
const cors = require('cors')
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cors())
app.use("/api/auth", authRoute)
mongoose.connect(process.env.MONGODB_URL).then(()=> {
app.listen(4000, ()=> {
    console.log("listening on port 4000")
})
}).catch((err)=> {
    console.log(err)
})
