
const mongoose = require('mongoose');

const FeaturedJobSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        ref: 'UserJob',
    }
});
//model          // collection name   // schema
const FeaturedJob = mongoose.model('FeaturedJob', FeaturedJobSchema);

module.exports = FeaturedJob;
