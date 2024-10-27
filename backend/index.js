import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import mongoose from "mongoose"
import userRoute from "./routes/user.route.js"; 
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

// const app= express()

// MongoDB connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/InstaClone", {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

connectDB();

app.get("/", (req,res)=>{
    return res.status(200).json({
        sandesh:"this message is coming from backend please help me",
        success:"true"
    })
})

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))

const corsOptions={
    origin:'http://localhost:5173',
    credentials: true 
}
app.use(cors(corsOptions))

// yha pr apni api ayengi
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);


const PORT=8000

server.listen(PORT, ()=>{
    console.log(`Server is listening at ${PORT}`)
})