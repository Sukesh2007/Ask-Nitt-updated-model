import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    rollno: {type: Number},
    tags: {type: Array, required: true},
    question: {type: String, required: true},
    isSolved: {type: Boolean, default: false}
},{timestamps: true, minimize: false})

export const Question = mongoose.model("question", questionSchema)