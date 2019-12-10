'use strict';

module.exports = {
    schema: {
        telegramId: {
            type: Number,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: false
        },
        lastName: {
            type: String,
            required: false
        },
        languageCode: {
            type: String,
            required: false
        },
        arjenLogin: {
            type: String,
            required: false
        },
        arjenPassword: {
            type: String,
            required: false
        },
        arjen: {
            username: {
                type: String,
                required: false
            }
        }
    },

    // instance methods goes here
    methods: {

    },

    // statics methods goes here
    statics: {
    }
};
