const env = process.env.NODE_ENV || 'development';

const models = require('../models');
const validationService = require('./validationService');

module.exports = {
    createUser: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.telegramId || !params.username) {
                reject('Missing params');
            } else {
                validationService.doesSuchUserExist(params.telegramId)
                .then(result => {
                    if (result) {
                        reject('This email has been used. Try Login');
                    } else {
                        new models.user(params).save()
                        .then(user => {
                            resolve(user);
                        }).catch((err) => {
                            console.error('Error occured while creating user:', err);
                            reject('Server side error');
                        });
                    }
                }).catch(err => {
                    console.error('User validation error', err);
                    reject('Server side error');
                });
            }
        });
    },

    getUser: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.email) {
                reject('Invalid Request');
            } else {
                validationService.doesSuchUserExist(params.email)
                .then(result => {
                    if (result) {
                        models.user.findOne({
                            email: params.email
                        }).then(user => {
                            if (user) {
                                resolve(user);
                            }
                        }).catch(err => {
                            reject('Server side Error');
                        })
                    } else {
                        reject('User does not exist');
                    }
                }).catch(err => {
                    console.error('User validation error', err);
                    reject('Server side error');
                });
            }
        });
    },

    updateUser: function(params) {
        return new Promise((resolve, reject) => {
            if (!params.email) {
                reject('Missing Params');
            } else {
                models.user.findOneAndUpdate({
                    email: params.email,
                }, params).then(user => {
                    if (user) {
                        resolve(user);
                    } else {
                        reject('No such User exist');
                    }
                }).catch(err => {
                    console.error('Error occured at saveUser', err);
                    reject('Server side error');
                });
            }
        });
    }
};
