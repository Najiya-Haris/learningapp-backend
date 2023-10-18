import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600 // This will automatically delete the document after 3600 seconds (1 hour)
    }
});

export default mongoose.model("Token", tokenSchema); // Export the model as "Token"
