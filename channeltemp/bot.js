 const Telegraf = require('telegraf');

const bot  = new  Telegraf('');

// code

bot.use(ctx => {
    console.log(ctx.chat);
})

bot.launch() 


