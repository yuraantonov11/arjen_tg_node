// const Telegraf = require('telegraf');
// const TelegrafInlineMenu = require('telegraf-inline-menu');
// const express = require('express');
// const http = require('http');
// const Scrapper = require('./lib/scrapper');
//
// const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}!`);
// const expressApp = express();
//
// // Scrapper.getPageHtml('http://google.com').then(data => console.log(data));
//
// const bot = new Telegraf(process.env.BOT_TOKEN);
// // expressApp.use(bot.webhookCallback('/secret-path'));
// // bot.telegram.setWebhook('https://server.tld:8443/secret-path');
//
// expressApp.get('/', (req, res) => {
//     res.send('Hello World!')
// });
//
// // prevent idle
// setInterval(function() {
//     http.get("http://arjen-tg-node.herokuapp.com");
// }, 300000); // every 5 minutes (300000)
//
// expressApp.listen(process.env.PORT, () => {
//     console.log(`Example app listening on port ${process.env.PORT}!`)
// });
//
// bot.use(menu.init());
// // bot.start((ctx) => ctx.reply('Welcome'));
// // bot.help((ctx) => ctx.reply('Send me a sticker'));
// // bot.on('sticker', (ctx) => ctx.reply('👍'));
// // bot.hears('hi', (ctx) => ctx.reply('Hey there'));
// // bot.launch();
// bot.startPolling();
