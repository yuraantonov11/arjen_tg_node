const Telegraf = require('telegraf');
const express = require('express');
const expressApp = express();

const bot = new Telegraf(process.env.BOT_TOKEN);
expressApp.use(bot.webhookCallback('/secret-path'));
// bot.telegram.setWebhook('https://server.tld:8443/secret-path');

expressApp.get('/', (req, res) => {
    res.send('Hello World!')
});

expressApp.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`)
});

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
