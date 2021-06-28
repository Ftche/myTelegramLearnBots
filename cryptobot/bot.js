const Telegraf = require('telegraf');

const axios = require('axios');

const bot  = new  Telegraf('');

const apikey = "";

//code

bot.command('start', ctx => {
    sendStartedMessage(ctx);
})

bot.action('start', ctx => {
    ctx.deleteMessage();
    sendStartedMessage(ctx);
})

function sendStartedMessage(ctx) {
    let startMessage = `Welcome, this bot gives you cryptocurrency information`;
    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Crypto Prices", callback_data: 'price'  }
                ],
                [
                    { text: "CoinMarketCap", url: 'https://coinmarketcap.com/'  }
                ],
                [
                    { text: "Bot Info", callback_data: 'info' }
                ]
            ]
        }
    });
}

bot.action('price', ctx => {
    let priceMessage = `Get Price Information. Select of the cryptocurrencies below`;
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, priceMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "BTC", callback_data: 'price-BTC'  },
                    { text: "ETH", callback_data: 'price-ETH'  }
                ],
                [
                    { text: "BCH", callback_data: 'price-BCH'  },
                    { text: "LTC", callback_data: 'price-LTC'  }
                ],
                [
                    { text: "Back to the menu", callback_data: 'start'  },
                ]
            ]
        }
    });
})

let priceActionList = ['price-BTC', 'price-ETH', 'price-BCH', 'price-LTC'];
bot.action(priceActionList, async ctx => {
    //console.log(ctx.match);
    let symbol = ctx.match.split('-')[1];
    //console.log(symbol);
    try {
        let res = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD,EUR&api_key=${apikey}`);
        //console.log(res.data.DISPLAY[symbol].USD);
        let data = res.data.DISPLAY[symbol].USD;
        let message = `
        Symbol : ${symbol}
        Price : ${data.PRICE}
        Open : ${data.OPENDAY}
        High : ${data.HIGHDAY}
        Low : ${data.LOWDAY}
        Supply : ${data.SUPPLY}
        Market Cap : ${data.MKTCAP}
        `;

        ctx.deleteMessage();
        bot.telegram.sendMessage(ctx.chat.id, message, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'back to prices', callback_data: 'price'}
                    ]
                ]
            }
        })
    } catch (error) {
        console.log(error);
        ctx.reply('Error Encountered ')
    }
    // https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD,EUR
})

bot.action('info', ctx => {
    ctx.answerCbQuery();
    bot.telegram.sendMessage(ctx.chat.id, "Bot Info", {
        reply_markup: {
            keyboard: [
                [
                    { text: "Credits"},
                    { text: "API"}
                ],
                [
                    { text: "Remove Keyboard"},
                ]
            ], resize_keyboard: true,
            one_time_keyboard: true
        }
    });
})

bot.hears('Credits', ctx => {
    ctx.reply('This bot was made by @name');
})

bot.hears('API', ctx => {
    ctx.reply('This bot uses cryptocompare API');
})

bot.hears("Remove Keyboard", ctx => {
    bot.telegram.sendMessage(ctx.chat.id, "Remove Keyboard", {
        reply_markup: {
            remove_keyboard: true
        }
    })
})

bot.launch();