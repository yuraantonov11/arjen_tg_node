const Telegraf = require('telegraf');
const TelegrafInlineMenu = require('telegraf-inline-menu');
const express = require('express');
const http = require('http');
const Scrapper = require('./lib/scrapper');
const validUrl = require('valid-url');


const menu = new TelegrafInlineMenu(ctx => `Привіт ${ctx.from.first_name}!`);
menu.setCommand('start');

const people = {};
menu.question('Отримати дані про товар', 'get', {
    uniqueIdentifier: '666',
    questionText: 'Введи посилання на товар',
    setFunc: async (_ctx, key) => {
        if (validUrl.isUri(key)){
            const url = new URL(key);
            if (url.hostname !== 'arjen.com.ua'){
                return _ctx.reply('Введи посилання на сайт arjen.com.ua.')
            }
            const data = await Scrapper.getProductData(key);
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
        people[key] = {};
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

expressApp.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`)
});

bot.use(menu.init());
// bot.start((ctx) => ctx.reply('Welcome'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));
// bot.on('sticker', (ctx) => ctx.reply('👍'));
// bot.hears('hi', (ctx) => ctx.reply('Hey there'));
// bot.launch();
bot.startPolling();

