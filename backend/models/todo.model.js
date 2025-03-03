const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    isCompleted: { 
        type: Boolean, 
        default: false 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }
}, {
    timestamps: true
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
