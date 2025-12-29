import { Router } from "express";
import {User} from '../mongodb/user_table.mjs'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()

const route = Router()

const {SECRET} = process.env

route.post('/register', async(req, res) => {
    try{
        const {body: {username, password, department, rollno}} = req;
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({name: username, password: hashedPassword, department, rollno})
        await newUser.save()
        res.send({
            msg: "Added"
        })
        console.log(newUser)
    }catch(err){
        res.send({
            msg: "Error in adding"
        })
        console.log(err)
    }
    res.sendStatus(200)
})

route.post('/auth', async(req, res) => {
    const {body: {username, password, rollno}} = req
    try{
        if(username){
            if(password){
                const user = await User.findOne({name: username, rollno})
                if(user && await bcrypt.compare(password, user.password)){
                    const token = jwt.sign({username, department: user.department}, `${SECRET}`)
                    res.json({token})
                }else{
                    res.json({
                        token: "Invalid Credentails"
                    })
                }
            }else {
                res.json({token: "Enter the password field"})
            }
        }else{
            res.json({
                token: "Enter the username field"
            })
        }
    }catch(err){
        console.log(err)
        res.status(501).send("There is a error check in the console")
    }
    
})

route.get('/auth/dashboard', (req, res) => {
    try{
        const fulltoken = req.header('Authorization').split(' ')
        var decodedToken = "error"
        if(fulltoken){
            decodedToken = jwt.verify(fulltoken[1], `${SECRET}`)
        }else{
            throw new Error("Header not sent")
        }
        if(decodedToken){
            res.send({
                name: decodedToken.username,
                department: decodedToken.department,
                msg: "Authorized"
            })
        }else{
            res.send({
                name: "", department: "",
                msg: "Access Denied"
            })
        }
    }catch(err){
        console.log(err)
        res.status(501).send({name: "", department: "", msg: "There is a error in dashboard"})
    }
})

route.get('/get/User', async(req, res) => {
    try{
        const {query: {rollno}} = req
        const data = await User.findOne({rollno}, {name: 1, department: 1, followers: 1, following: 1})
        if(data){
            res.send({
                username: data.name,
                department: data.department,
                followers: data.followers,
                following: data.following,
                msg: "Success"
            })
        }else{
            res.send({
                username: "-",
            rollno: 0,
            department: "-",
            followers: 0,
            following: 0,
            msg: "Nill"
            })
        }

    }catch(e){
        res.status(500).send({
            username: "-",
            rollno: 0,
            department: "-",
            followers: 0,
            following: 0,
            msg: "Error"
        })
        console.log(e)
    }
})

export default route