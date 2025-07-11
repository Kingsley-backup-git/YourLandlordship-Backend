const express = require("express")
const { default: mongoose } = require("mongoose")
const authRoute = require("./routes/auth/authRoute")
const propertyRoute = require("./routes/property/propertyRoute")
const cors = require('cors')
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cors({
  origin: "*", 
  credentials: true 
}));
app.use("/api/auth", authRoute)
app.use("/api/property", propertyRoute)
mongoose.connect(process.env.MONGODB_URL).then(()=> {
app.listen(4000, ()=> {
    console.log("listening on port 4000")
})
}).catch((err)=> {
    console.log(err)
})
