import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const {MONGO_URI} = process.env

export async function mongo_connect() {
        await mongoose.connect(MONGO_URI).then(() => {
        console.log("Database Connected")
    })
}