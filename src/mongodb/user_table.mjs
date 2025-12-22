import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    department: {type: String, required: true},
    rollno: {type: Number, required: true, unique: true}
}, {timestamps: true})

export const User = mongoose.model("User", userSchema);