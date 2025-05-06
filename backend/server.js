const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
const reciperoutes = require("./routes/reciperoutes")

dotenv.config();
const PORT=process.env.PORT||5000;

const app=express();//running the app with express framework
app.use(express.json()); //in json format
app.use(cors());//connecting backend and frontend

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongodb Connected Successfully"))
.catch((err)=>console.log("Mongodb Error",err))

app.get("/",(req,res)=>{
    res.send("DISHQUEST IS RUNNING");
})

app.use('/api/recipe',reciperoutes)

app.listen(PORT,()=>
    console.log(`Server is running on http://localhost:${PORT}`
    ));