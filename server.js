const Telegraf = require('telegraf');
const TelegrafInlineMenu = require('telegraf-inline-menu');
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const Scrapper = require('./lib/scrapper');
const validUrl = require('valid-url');
const {getArjenCredentials} = require("./services/userService");
const {updateArjenPassword} = require("./services/userService");
const {updateArjenUsername} = require("./services/userService");
const {createUser, updateUser} = require("./services/userService");


const formatData = (data) => ({
    telegramId: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    username: data.username,
    languageCode: data.language_code,
});

const menu = new TelegrafInlineMenu(async ctx => {
    const userData = formatData(ctx.from);
    // await createUser(userData);

    return `Привіт ${ctx.from.first_name}!`
});
menu.setCommand('start');

menu
    .submenu(
        'Авторизуватись в arjen.com.ua',
        's',
        new TelegrafInlineMenu('Введи свої дані до сайту arjen.com.ua щоб бачити ціни дропшипера.')
    )
    .question('Ввести логін', 'username',
        {
            uniqueIdentifier: 'username',
            questionText: 'Введи логін',
            joinLastRow: true,
            setFunc: async (_ctx, key) => {
                try {
                    const userData = formatData(_ctx.from);
                    await updateArjenUsername(userData.telegramId, key)
                } catch(e) {
                    console.error(e);
                }
            }
        })
    .question('Ввести пароль', 'password',
        {
            uniqueIdentifier: 'password',
            questionText: 'Введи пароль',
            joinLastRow: true,
            setFunc: async (_ctx, key) => {
                await _ctx.deleteMessage();
                try {
                    const userData = formatData(_ctx.from);
                    await updateArjenPassword(userData.telegramId, key)
                } catch(e) {
                    console.error(e);
                }
            }
        })
    .button('Назад', 'back', {
        setParentMenuAfter: true,
        doFunc: ctx => {
        }
    });

const people = {};
menu.question('Отримати дані про товар', 'get', {
    uniqueIdentifier: '666',
    questionText: 'Введи посилання на товар',
    setFunc: async (_ctx, key) => {
        if (validUrl.isUri(key)) {
            const url = new URL(key);
            if (url.hostname !== 'arjen.com.ua') {
                return _ctx.reply('Введи посилання на сайт arjen.com.ua.')
            }
            const credentials = await getArjenCredentials(_ctx.from.id);
            const data = await Scrapper.getProductData(key, credentials);
            return _ctx.reply(JSON.stringify(data))
        } else {
            return _ctx.reply('Не вірне писилання.');
        }

    }
});

menu.question('Підписатись на наявність товару (в розробці)', 'subscribe', {
    uniqueIdentifier: '666',
    questionText: 'Введи посилання на товар',
    setFunc: (_ctx, key) => {
        people[ key ] = {};
        console.log(people);
    }
});

const expressApp = express();

// Scrapper.getPageHtml('http://google.com').then(data => console.log(data));

const bot = new Telegraf(process.env.BOT_TOKEN);
// expressApp.use(bot.webhookCallback('/secret-path'));
// bot.telegram.setWebhook('https://server.tld:8443/secret-path');

expressApp.get('/', (req, res) => {
    res.send('Hello World!')
});

// prevent idle
setInterval(function() {
    http.get("http://arjen-tg-node.herokuapp.com");
}, 300000); // every 5 minutes (300000)

mongoose.connect('mongodb://yuraantonov11:r8DoC6ohdJds@ds353738.mlab.com:53738/arjen_tg_bot',
    {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {

        if (err) {
            console.error('Error connecting to db: ', err);
        } else {
            console.info('Mongodb connection successful');
        }

        /**
         * Listen on provided port, on all network interfaces.
         */

        expressApp.listen(process.env.PORT, () => {
            console.log(`Example app listening on port ${process.env.PORT}!`)
        });
    });

bot.use(menu.init());
bot.start((ctx) => ctx.reply('Welcome'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));
// bot.on('sticker', (ctx) => ctx.reply('👍'));
// bot.hears('hi', (ctx) => ctx.reply('Hey there'));
// bot.launch();
bot.startPolling();

