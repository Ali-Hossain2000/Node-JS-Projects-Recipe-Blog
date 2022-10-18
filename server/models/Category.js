const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    image: {
        type: String,
        required: 'This field is required.'
    },
});

module.exports = mongoose.model('Catagory', categorySchema);