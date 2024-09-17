import express from "express"
import dotenv from "dotenv"
import http from "http"
const app = express()
app.use(express.json())
dotenv.config()


const server= http.createServer(app)
const port = process.env.PORT
app.get('/',async(req,res,next)=>{
    return res.status(200).json({'message':'working!'})
})
server.listen(port,()=>{
    console.log('app is listening on port',port)
})
export default server