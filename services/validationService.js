const models = require('../models');

module.exports = {
    doesSuchUserExist: async function(telegramId) {
        const user = await models.user.findOne({telegramId});
        return !!user
    }
};
