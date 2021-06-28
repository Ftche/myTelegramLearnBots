const Telegraf = require('Telegraf');

const bot  = new  Telegraf('');

const axios  = require('axios');
const fs = require('fs');
const { format } = require('path');

const helpMessage = `

*Simple API Bot*
/fortune - get a fortune cookie
/cat - get a random cat picture
/cat \`<text>\` - get cat image with text
/dogbreeds - get list of dor breeds
/dogs \`<breeds>\` - get image of dog breed
`;
//code
bot.command(['start', 'help'], ctx => {
    //ctx.reply(helpMessage);
    bot.telegram.sendMessage(ctx.from.id, helpMessage, {
        parse_mode: "markdown"
    })
})

bot.command('fortune', (ctx) => {
    axios.get('http://yerkee.com/api/fortune').then(res => {
        //console.log();
        ctx.reply(res.data.fortune);
    }).catch(e =>  {
        console.log(e);
    })
})

bot.command('cat', async (ctx) => {
    let input = ctx.message.text;
    let inputArray = input.split(" ");

    if (inputArray.length == 1){
        try {
            let res = await axios.get('https://aws.random.cat/meow');
            ctx.replyWithPhoto(res.data.file);
        } catch (e) {
            console.log(e);
        }
    } else {
        inputArray.shift();
        input = inputArray.join(" ");
        ctx.replyWithPhoto(`https://cataas.com/cat/says/${input}`);
    }
})

bot.command('dogbreeds', (ctx) => {
    let rawdata = fs.readFileSync("./dogbreeds.json", "utf8");
    let data = JSON.parse(rawdata);
    //console.log(data);

    let mesage = "Dog Breeds:\n";
    data.forEach(item => {
        mesage += `-${item}\n`
    })

    ctx.reply(mesage);
})

bot.command('dogs', (ctx) => {
    let input = ctx.message.text.split(" ");
    if(input.length != 2){
        ctx.reply(" You must give a dog breeds as the second argument");
        return ;
    }
    let breedInput = input[1];

    let rawdata = fs.readFileSync("./dogbreeds.json", "utf8");
    let data = JSON.parse(rawdata);

    if (data.includes(breedInput)){
        axios.get(`https://dog.ceo/api/breed/${breedInput}/images/random`)
        .then( res => {
            //console.log(res.data);
            ctx.replyWithPhoto(res.data.message);
        } ).catch( e => {
            console.log(e);
        });

    } else {
        let suggestion = data.filter(item => {
            return item.startsWith(breedInput);
        });

        let message = `Did you mean: \n`;

        suggestion.forEach(item => {
            message += `-${item}\n`;
        } )

        if(suggestion.lenght == 0 ){
            ctx.reply('Cannot find breed');
        } else {
            ctx.reply(message);
        }
    }

})

bot.launch();