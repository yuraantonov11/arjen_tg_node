const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
    console.log('Welcome');
    return ctx.reply('Welcome')
});
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
