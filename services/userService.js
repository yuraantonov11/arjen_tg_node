const env = process.env.NODE_ENV || 'development';

const models = require('../models');
const validationService = require('./validationService');

module.exports = {
    createUser: async function(params) {
        if (!params.telegramId || !params.username) {
            throw 'Missing params';
        } else {
            let isUserExist;
            try {
                isUserExist = await validationService.doesSuchUserExist(params.telegramId)
            } catch {
                throw 'Server side error';
            }
            if (isUserExist) {
                throw 'This user already exist';
            } else {
                return await models.user(params).save()
            }

        }
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

    updateUser: async function(params) {
        if (!params.telegramId) {
            throw 'Missing Params';
        } else {
            const user = await models.user.findOneAndUpdate({
                telegramId: params.telegramId,
            }, params);
            if (user) {
                return user;
            } else {
                throw 'No such User exist';
            }
            // console.error('Error occured at saveUser', err);
            // reject('Server side error');
        }
    },

    getArjenCredentials: async function(telegramId){
        const user = await models.user.findOne({telegramId})
            .select({
                'arjen.username': 1,
                'arjen.password': 1
            });
        if(user){
            return user._doc.arjen
        }
        return null
    },

    updateArjenPassword: async function(telegramId, pwd) {
        if (!telegramId || !pwd) {
            throw 'Missing Params';
        } else {
            const user = await models.user.findOneAndUpdate(
                {telegramId},
                {$set: {'arjen.password': pwd}
            });

            if (user) {
                return user;
            } else {
                throw 'No such User exist';
            }
        }
    },

    updateArjenUsername: async function(telegramId, username) {
        if (!telegramId || !username) {
            throw 'Missing Params';
        } else {
            const user = await models.user.findOneAndUpdate(
                {telegramId},
                {$set: {'arjen.username': username}
                });

            if (user) {
                return user;
            } else {
                throw 'No such User exist';
            }
        }
    },

    setPassword(){}
};
