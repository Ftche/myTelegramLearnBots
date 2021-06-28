const Telegraf = require('telegraf');

const bot  = new Telegraf('');

bot.command('start', ctx => {
    ctx.reply("Hello World !");

    bot.telegram.sendMessage(ctx.chat.id, "Hello world !");
})

bot.launch();