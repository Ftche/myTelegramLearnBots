const Telegraf = require("telegraf");

const bot = new Telegraf("");

bot.command(['start', 'help'], ctx => {
    let message = `
  Help Reference:
  /douala - get image of New York
  /maroua - get gif of Dubai
  /sud - get location of Singapore
  /villes - get photos of cities
  /villeslistes - get text file cities
    `;
    ctx.reply(message);
  })

bot.command("douala", (ctx) => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
  // url
  bot.telegram.sendPhoto(ctx.chat.id,
    {
      source: "res/douala.jpg",
    },
    {
      reply_to_message_id: ctx.message.message_id,
    }
  );
})

bot.command("maroua", (ctx) => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_video");
  // url
  bot.telegram.sendAnimation(ctx.chat.id,
    "https://1.bp.blogspot.com/_qZOR1DWi7Xw/TLCROnWtNqI/AAAAAAAAADY/TFtLjOWcV-4/s1600/yagoua.gif",
    {
      reply_to_message_id: ctx.message.message_id,
    }
  );
})

bot.command('villes', ctx => {
    let villes = ['res/douala.jpg', 'res/sud.jpg', 'res/maroua.jpg'];

    let result = villes.map(city =>  {
        return {
            type: 'photo', media: { source: city}
        }
    })
    bot.telegram.sendMediaGroup(ctx.chat.id, result);
})

bot.command('villeslistes', ctx => {
    bot.telegram.sendDocument(ctx.chat.id, 
    {
        source: "res/villeslistes.txt"
    }, {
        thumb: { source: "res/douala.jpg"}
    })
})

bot.command('sud', ctx => {
    bot.telegram.sendLocation(ctx.chat.id, 2.926915311035728, 11.979194147042783);
})

bot.on('message', async ctx => {
    if (ctx.updateSubTypes[0] == 'document') {
      try {
        let link = await bot.telegram.getFileLink(ctx.message.document.file_id);
        ctx.reply('Your download link: ' + link);
      } catch (err) {
        console.log(err);
        ctx.reply(err.description);
      }
    } else if (ctx.updateSubTypes[0] == 'photo') {
      console.log();
      try {
        let link = await bot.telegram.getFileLink(ctx.message.photo[0].file_id);
        ctx.reply('Your download link: ' + link);
      } catch (err) {
        console.log(err);
        ctx.reply(err.description);
      }
    }
  })

bot.launch();
