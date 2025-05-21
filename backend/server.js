const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
const reciperoutes = require("./routes/reciperoutes")
const userrouter=require("./routes/authroutes")

dotenv.config();
const PORT=process.env.PORT||5000;

const app=express();
app.use(express.json()); 
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MONGODB CONNECTED SUCCESSFULLY")
    app.listen(PORT,()=>
    console.log(`Server is running on http://localhost:${PORT}`
    ));

})
.catch((err)=>console.log("Mongodb Error",err))



app.use('/api/recipe',reciperoutes)
app.use('/api',userrouter)

