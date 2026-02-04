const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    purchaseDate: {
        type: Date,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: false,
    },
    category: {
        type: String,
        required: true
    },
    reminderDate: {
        type: Date,
        required: false,
        validate: {
            validator: function(value) {
                return !value || value < this.expiryDate;
            },
            message: 'Reminder date must be before expiry date'
        }
    },
    status: {
        type: String,
        enum: ["Active", "Expired"],
        default: "Active",
    },
    
}, { timestamps: true });
    

module.exports = mongoose.model("Item", itemSchema);