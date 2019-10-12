var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
SALT_WORK_FACTOR = 10;

var seller = new mongoose.Schema({

    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    pincode: {
        type: Number
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    created_date: {
        type: Date,
        default: Date.now()
    },
    modified_date: {
        type: Date,
        default: Date.now()
    }
});


seller.pre('save', function (next) {
    const seller = this;
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(seller.password, salt, function (err, hash) {
            if (err) return next(err);
            console.log(hash);
            seller.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('seller', seller, 'sellers');