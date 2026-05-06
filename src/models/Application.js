const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    proposedBudget: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);