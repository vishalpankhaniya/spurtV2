// Service Variable

const sellerService = require('../services/seller.service');

module.exports.createSeller = (req, res) => {

    const sellerData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile,
        address: req.body.address,
        city: req.body.city,
        pincode: req.body.pincode
    }

    sellerService.createSeller(sellerData).then((response) => {
        return res.status(200).json({ message: response.message, status: 1 });
    }).catch((error) => {
        console.log('error: ', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal Server Error' });
    });
}

module.exports.sellerList = (req, res) => {
    sellerService.sellerList().then((response) => {
        return res.status(200).json({ message: response.message, status: 1, data: response.data });
    }).catch((error) => {
        console.log('error: ', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal Server Error' });
    });
}


module.exports.removeSeller = (req, res) => {

    const sellerId = req.params.id;

    console.log('SellerId:', sellerId);

    sellerService.removeSeller(sellerId).then((response) => {
        return res.status(200).json({ message: response.message, status: 1 });
    }).catch((error) => {
        console.log('error:', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal Server Error' });
    })
}

module.exports.updateSeller = (req, res) => {

    const sellerData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile,
        address: req.body.address,
        city: req.body.city,
        pincode: req.body.pincode,
    }

    const sellerId = req.params.id;

    console.log('SellerId:', sellerId);

    console.log('Seller Data:', sellerData);

    sellerService.updateSeller(sellerId, sellerData).then((response) => {
        return res.status(200).json({ message: response.message, status: 1 });
    }).catch((error) => {
        console.log('error: ', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal Server Error' });
    });
}


module.exports.sellerLogin = (req, res) => {

    const sellerData = {
        email: req.body.emailId,
        password: req.body.password,
    }

    console.log("sellerData Data", sellerData);

    sellerService.sellerLogin(sellerData).then((response) => {
        return res.status(200).json({ message: response.message, data: response.data, status: 1 });
    }).catch((error) => {
        console.log('error: ', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal Server Error', status: 0 });
    });
}



