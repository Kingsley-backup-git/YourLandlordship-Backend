const express = require("express")
const { default: mongoose } = require("mongoose")
const authRoute = require("./routes/auth/authRoute")
const propertyRoute = require("./routes/property/propertyRoute")
const tenantRoute = require("./routes/tenant/tenant")
const cors = require('cors')
const cookieParser = require('cookie-parser');
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true 
}));
app.use("/api/auth", authRoute)
app.use("/api/property", propertyRoute)
app.use("/api/tenant", tenantRoute)
mongoose.connect(process.env.MONGODB_URL).then(()=> {
app.listen(4000, ()=> {
    console.log("listening on port 4000")
})
}).catch((err)=> {
    console.log(err)
})
