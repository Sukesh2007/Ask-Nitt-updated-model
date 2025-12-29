import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    department: {type: String, required: true},
    rollno: {type: Number, required: true, unique: true},
    followers: {type: Number, default: 0},
    following: {type: Number, default: 0}
}, {timestamps: true, minimize: false})

export const User = mongoose.model("User", userSchema);