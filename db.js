const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(
        'MONGO URI HERE', 
        { useNewUrlParser: true, useUnifiedTopology: true }, 
        () => console.log('mongoose connected to ish_dev')
    )
}


