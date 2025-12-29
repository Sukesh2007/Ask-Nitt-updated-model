import express from 'express'
import dotenv from 'dotenv'
import { mongo_connect } from './mongodb/mongo_connect.mjs'
import usersRoute from './routes/users.mjs'
import questionRoute from './routes/question.mjs'
dotenv.config()

const {
    PORT
} = process.env

const app = express()

await mongo_connect()

app.get('/', (req, res) => {
    res.send("Welcome Express")
})

app.use(express.json())
app.use(usersRoute)
app.use(questionRoute)

const port = PORT || 3000

app.listen(port , ()=>{
    console.log("your site is running on PORT")
})