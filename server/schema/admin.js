const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    admin_user: {
        type: String,
        required: true,
        unique: true
    },
    admin_password: {
        type: String,
        required: true
    },
});

const admin = mongoose.model('Admin', adminSchema);

module.exports = admin;