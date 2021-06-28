const Telegraf = require('telegraf');

const bot =  new Telegraf('');

const helpMessage = `
Say something to me
/start - start the bot
/help - command reference
/echo - say "You said echo"
/echo <msg> - echo a message
`;

bot.use((ctx, next) => {
    //console.log(ctx.chat);
    if(ctx.updateSubTypes[0] == "text"){
        //console.log();
        bot.telegram.sendMessage(-430602967, ctx.from.username + " said: " + ctx.message.text);
    } else {
        bot.telegram.sendMessage(-430602967,ctx.from.username + " sent " + ctx.updateSubTypes[0]);
        //console.log();
    }
    next();
})

bot.start((ctx) => {
    ctx.reply("Hi I am Echo Bot S237");
    ctx.reply(helpMessage);
})

bot.help((ctx) => {
    ctx.reply(helpMessage);
})

bot.command("echo", (ctx) => {
    let input = ctx.message.text;
    let inputArray = input.split(" ");
    //console.log(inputArray);

    let message = "";
    if(inputArray.length == 1){
        message = "You said echo";
    } else {
        inputArray.shift();
        message = inputArray.join(" ");
    }
    ctx.reply(message);
})


bot.launch()