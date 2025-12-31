import { Question } from "../mongodb/question_table.mjs";
import {Router} from "express"

const route = Router()

route.post('/question/post', async(req, res)=>{
    try{
        const {body: {rollno, tags, question}} = req
        if(typeof rollno !== "number" || typeof question !== "string"){
            return res.status(401).send({msg: "Check the type"})
        }
        const newQuestion = new Question({rollno, question, tags})
        await newQuestion.save()
        res.status(200).send({msg: "Saved Successfully"})
    }catch(err){
        console.log(err)
        res.status(401).send({msg: "Error in sending the data"})
    }
})

route.get('/question/get', async(req , res) => {
    try{
        const {query: {rollno}} = req
        const questions = await Question.find({rollno}, {tags: 1, question: 1, createdAt: 1, isSolved: 1, rollno: 1})
        const formatted = questions.map(t=> {
           const date = t.createdAt.getDate()
            const month = t.createdAt.getMonth()
            const year = t.createdAt.getFullYear()
            const hour = t.createdAt.getHours()
            const minutes = t.createdAt.getMinutes()
            const seconds = t.createdAt.getSeconds()
            return (
                {...t.toObject(),
                   createdAt: `${date}/${month + 1}/${year} ${hour}:${minutes}:${seconds}`
                }
            )
        }
        )
        if(questions){
            return res.status(200).send({questions: formatted, msg: "Success"})
        } else {
            return res.status(404).send({questions: [], msg: "No questions asked"})
        }
    }catch(err){
        console.log(err)
        return res.status(501).send({questions: [], msg: "Error happened in server"})
    }
})

route.patch('/question/mark/solved', async(req, res) => {
    try{
        const {query: {q_id}} = req;
        const question = await Question.findOne({_id: q_id})
        if(!question) return res.send(404).send({msg: "Error", question: {id: "null", isSolved: false}})
        await Question.updateOne({_id: q_id}, {isSolved: !question.isSolved})
        if(question){
            return res.status(200).send({msg: "Success", question: {id: question.id.toString(), isSolved: !question.isSolved}})
        }else {
            return res.status(404).send({msg: "Record not found", question: {id: "null", isSolved: false}})
        }
    }catch(err){
        console.log(err)
        return res.status(501).send({msg: "Error in Server", question: {id: "null", isSolved: false}})
    }
})

route.get('/question/others/get', async(req, res) => {
    try{
        const {query: {rollno}} = req
        const questions = await Question.find({rollno: {$ne : rollno}}, {_id: 1, question: 1, tags: 1, createdAt: 1, isSolved: 1, rollno: 1})
        questions.sort((a,b) => a.rollno - b.rollno)
        if(!questions) return res.send({msg: "No Questions", questions: []})
        // res.status(200).send({msg: "Success", questions: questions})
    const formatted = questions.map(t=> {
            const days = new Date(t.createdAt)
            t.createdAt = days.toLocaleString("en-IN", {"timeZone": "Asia/Kolkata"})
           const date = t.createdAt.getDate()
            const month = t.createdAt.getMonth()
            const year = t.createdAt.getFullYear()
            const hour = t.createdAt.getHours()
            const minutes = t.createdAt.getMinutes()
            const seconds = t.createdAt.getSeconds()
            return (
                {...t.toObject(),
                   createdAt: `${date}/${month + 1}/${year} ${hour}:${minutes}:${seconds}`
                }
            )
        })
        return res.status(200).send({msg: "Success" , questions: formatted})
    }catch(err){
        console.log(err)
        return res.status(501).send({msg: "Error in the Server", questions: []})
    }
})

export default route