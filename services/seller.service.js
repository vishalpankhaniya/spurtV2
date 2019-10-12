// Database models

const seller = require('../models/seller.model');

// Static variables
const ObjectId = require('mongodb').ObjectId;


module.exports.createSeller = (sellerData) => {

    console.log("Seller Data:", sellerData);

    return new Promise((resolve, reject) => {

        checkSellerRegister(sellerData.email).then((Response) => {
            if (Response) {
                seller.create(sellerData, (sellerError, sellerRes) => {
                    if (sellerError) {
                        console.log('sellerError: ', sellerError);
                        reject({ status: 500, message: 'Internal Server Error' });
                    } else {
                        resolve({ status: 200, message: 'Successfully Added New Seller', data: sellerRes });
                    }
                });
            } else {
                reject({ status: 500, message: 'Seller Already Registered.' });
            }
        }).catch((error) => {
            reject({ status: 500, message: 'Internal Server Error' });
        });
    });
}

module.exports.sellerLogin = (body) => {
    console.log('login body: ', body);
    return new Promise((resolve, reject) => {
        seller.findOne({ email: body.email }).exec((err, seller) => {
            if (err) {
                reject({ status: 500, message: 'Internal Server Error' });
            } else if (seller) {
                seller.comparePassword(body.password, seller.password, (error, isMatch) => {
                    if (error) {
                        reject({ status: 400, message: 'Invalid EmailId' });
                    } else if (isMatch) {
                        const payload = { customer };
                        var token = jwt.sign(payload, 'pmt');
                        console.log("Token = ", token);
                        const tokendata = { token: token }
                        resolve({ status: 200, message: 'Successfully login', data: tokendata })
                    } else {
                        reject({ status: 400, message: 'Invalid Password' });
                    }
                });
            } else {
                reject({ status: 500, message: 'User not found' });
            }
        });
    });
}



const checkSellerRegister = (email) => {
    return new Promise((resolve, reject) => {
        seller.findOne({ email: email }, (sellerErr, sellerRes) => {
            if (sellerErr) {
                console.log('Seller Error:', sellerErr);
                reject({ status: 500, message: 'Internal Server Error' });
            } else if (!sellerRes) {
                console.log('Seller is not Registered');
                resolve(true);
            } else {
                console.log('seller is alredy Registered');
                resolve(false);
            }
        });
    });
}

module.exports.sellerList = () => {
    return new Promise((resolve, reject) => {
        seller.aggregate([
            {
                $project: {
                    sellerId: '$_id',
                    first_name: '$first_name',
                    last_name: '$last_name',
                    email: '$email',
                    mobile: '$mobile',
                    address: '$address',
                    city: '$city',
                    pincode: '$pincode',
                    isActive: '$is_active',
                }
            },
        ]).exec(function (sellerError, sellerList) {
            if (sellerError) {
                reject({ status: 500, message: 'Internal Server Error' });
            } else {
                resolve({ status: 200, message: 'Successfully get sellerList', data: sellerList });
            }
        })

    })
}

module.exports.removeSeller = (sellerId) => {
    return new Promise((resolve, reject) => {
        console.log('Seller Id:', sellerId);
        seller.findByIdAndUpdate({ _id: sellerId }, { $set: { isDeleted: true } }, (sellerErr, sellerRes) => {
            if (sellerErr) {
                console.log('Seller Remove Error:', sellerErr);
                reject({ status: 500, message: 'Internal Server Error' });
            } else {
                resolve({ status: 200, message: 'Seller Removed Successfully', data: sellerRes });
            }
        });
    });
}

module.exports.updateSeller = (sellerId, sellerData) => {
    return new Promise((resolve, reject) => {
        console.log('Seller Id:', sellerId);
        seller.findByIdAndUpdate({ _id: sellerId }, sellerData, (sellerErr, sellerRes) => {
            if (sellerErr) {
                console.log('Seller Remove Error:', sellerErr);
                reject({ status: 500, message: 'Internal Server Error' });
            } else {
                resolve({ status: 200, message: 'Seller Updated Successfully', data: sellerRes });
            }
        });
    });
}


