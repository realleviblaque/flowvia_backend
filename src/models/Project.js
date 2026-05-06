const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        projectType: {
            type: String,
            required: true,
            enum: ['personal', 'client', 'open'],
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['open', 'negotiation', 'taken', 'completed', 'cancelled'],
            default: 'open'
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        team : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            default: null
        },
        skillsRequired: [
            {
                type: String,
                trim: true
            }
        ],
        budget: {
            type: Number,
            min: 0
        },
        deadline: {
            type: Date,
            default: null
        },
        isPublic: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Project', projectSchema);