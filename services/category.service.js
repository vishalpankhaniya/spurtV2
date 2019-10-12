// Npm modules
const mongoose = require('mongoose');
const path = require('path');
const Url = require('url');
var _ = require('lodash');
var arrayToTree = require('array-to-tree');


// Database models
var category = require('../models/category.model');

// Static variables
const ObjectId = require('mongodb').ObjectId;

// Services

module.exports.categoryList = (categoryData) => {
    return new Promise((resolve, reject) => {
        if (categoryData.count == 'true' || categoryData.count == 1) {
            category.count((useerr, userres) => {
                if (useerr) {
                    console.log('usererror: ', useerr);
                    reject({ status: 500, message: 'Internal Server Error' });
                } else {
                    resolve({ status: 200, message: 'Successfully got the complete list of categorys', data: userres });
                }
            });
        }
        else {
            category.aggregate([
                {
                    $project: {
                        categoryId: '$_id',
                        name: '$name',
                        image: '$image',
                        imagePath: '$image_path',
                        parentInt: '$parent_int',
                        sortOrder: '$sort_order',
                        isActive: '$is_active',
                        metaTagTitle: '$meta_tag_title',
                        metaTagDescription: '$meta_tag_description',
                        metaTagKeyword: '$meta_tag_keyword',
                    }
                },

            ]).exec(function (Error, categoryData) {
                if (Error) {
                    console.log('error: ', Error);
                    reject({ status: 500, message: 'Internal Server Error' });
                } else {
                    var finalCategory = [];


                    _.forEach(categoryData, function (index) {
                        const Cat = {
                            categoryId: String(index.categoryId),
                            name: (index.name),
                            parentInt: String(index.parentInt),
                            metaTagTitle: (index.metaTagTitle),
                            metaTagDescription: (index.metaTagDescription),
                            metaTagKeyword: (index.metaTagKeyword),
                        }

                        finalCategory.push(Cat);
                    });

                    const categoryList = arrayToTree(finalCategory, {
                        parentProperty: 'parentInt',
                        customID: 'categoryId'
                    });

                    resolve({ status: 200, message: 'Successfully get manufacturer list', data: categoryList });
                }
            })
        }
    })
}

module.exports.deleteCategory = (categoryId) => {
    console.log("body in country===>", categoryId);
    return new Promise((resolve, reject) => {
        category.findByIdAndRemove({ _id: categoryId }, (useerr, userres) => {
            if (useerr) {
                console.log('usererror: ', useerr);
                reject({ status: 500, message: 'Internal Server Error' });
            } else {
                resolve({ status: 200, message: 'Successfully deleted Category.', data: userres });
            }
        });
    })
}

module.exports.addCategory = (categoryData) => {
    console.log("categoryData in country===>", categoryData);
    return new Promise((resolve, reject) => {
        category.create(categoryData, (useerr, userres) => {
            if (useerr) {
                console.log('usererror: ', useerr);
                reject({ status: 500, message: 'Internal Server Error' });
            } else {
                resolve({ status: 200, message: 'Successfully created new Category.', data: userres });
            }
        });
    })
}

module.exports.updateCategory = (categoryId, categoryData) => {
    console.log("categoryData in service===>", categoryData);
    console.log("categoryid in service====>", categoryId);
    return new Promise((resolve, reject) => {
        category.findByIdAndUpdate({ _id: categoryId }, categoryData, (useerr, userres) => {
            if (useerr) {
                console.log('usererror: ', useerr);
                reject({ status: 500, message: 'Internal Server Error' });
            } else {
                resolve({ status: 200, message: 'Successfully updated Category.', data: userres });
            }
        });
    })
}


module.exports.updateChildren = (parent, childrenId) => {
    console.log("parent in service===>", parent);
    console.log("childrenId in service====>", childrenId);
    return new Promise((resolve, reject) => {
        category.findOne({ _id: parent }, (useerr, category) => {
            if (useerr) {
                console.log('usererror: ', useerr);
                reject({ status: 500, message: 'Internal Server Error' });
            } else {
                console.log("founded category=======>>", category);
                category.children.push(childrenId);
                category.save();
                resolve({ status: 200, message: 'Successfully updated Category.', data: category });
            }
        });
    })
}


module.exports.categoryByList = (categoryData) => {
    return new Promise((resolve, reject) => {
        if (categoryData.count == 'true' || categoryData.count == 1) {

            category.count((useerr, userres) => {
                if (useerr) {
                    console.log('usererror: ', useerr);
                    reject({ status: 500, message: 'Internal Server Error' });
                } else {
                    resolve({ status: 200, message: 'Successfully got the complete list of categorys', data: userres });
                }
            });
        }
        else {

            var searchText = categoryData.keyword;


            var query = {
                $and: [
                    { 'name': { $regex: new RegExp(searchText, 'i') }, },
                ]
            }

            const aggregate =
                [
                    {
                        $match: query
                    },
                    {
                        $project: {
                            categoryId: '$_id',
                            name: '$name',
                            image: '$image',
                            imagePath: '$image_path',
                            parentInt: '$parent_int',
                            sortOrder: '$sort_order',
                            metaTagTitle: '$meta_tag_title',
                            metaTagDescription: '$meta_tag_description',
                            metaTagKeyword: '$meta_tag_keyword',
                            children: '$children'
                        }
                    }
                ]

            if (categoryData.limit) {
                aggregate.push({ $limit: categoryData.offset + categoryData.limit });
                aggregate.push({ $skip: categoryData.offset });
            }


            if (categoryData.sortOrder == 1) {

                console.log("Sort Order 1:", categoryData.sortOrder);

                aggregate.push({ $sort: { sort_order: 1 } });
            }

            if (categoryData.sortOrder == 2) {
                console.log("Sort Order 2:", categoryData.sortOrder);

                aggregate.push({ $sort: { sort_order: -1 } });
            }

            category.aggregate(aggregate).exec(function (Error, Response) {
                if (Error) {
                    console.log('error: ', Error);
                    reject({ status: 500, message: 'Internal Server Error' });
                } else {
                    resolve({ status: 200, message: 'Successfully get Category list', data: Response });
                }
            })

        }
    })
}


