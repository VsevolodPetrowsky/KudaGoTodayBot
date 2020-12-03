global.fetch = require('node-fetch');
require('dotenv').config();
const { Telegraf } = require('telegraf');


const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply(`
Привет ${ctx.from.first_name}!
Узнай события дня в твоем городе.
Введи свой город на английском языке в формате:
msk если Москва,
spb если Санкт-Петербург.
Получить весь список городов можно по команде /help.
`));

bot.help((ctx) => ctx.reply(`
spb - Санкт-Петербург
msk - Москва
nsk - Новосибирск
ekb - Екатеринбург
nnv - Нижний Новгород
kzn - Казань
vbg - Выборг
smr - Самара
krd - Краснодар
sochi - Сочи
ufa - Уфа
krasnoyarsk - Красноярск
kev - Киев
new-york - Нью-Йорк`));

bot.on('text', async (ctx) => {
  try {
    const city = ctx.message.text

    const responseFirst = await fetch(`https://kudago.com/public-api/v1.4/events-of-the-day/?location=${city}`);

    const events = await responseFirst.json();

    if (events.count === 0) {
      ctx.reply('Из за пандемии в вашем городе нет событий дня, по возможности оставайтесь дома и будте здоровы');
    }
    else if (events.count == undefined) {
      ctx.reply('Вы неправильно ввели город, для получения списка городов используй команду /help');
    }
    else {
      events.results.forEach(async (element) => {
        const object = element.object;
        const responseSecond = await fetch(`https://kudago.com/public-api/v1.4/events/${object.id}`);
        const eventInfo = await responseSecond.json();

        const name = eventInfo.title.replace(/(\<(\/?[^>]+)>)/gm, '');

        const result = `
        <a href="${eventInfo.site_url}"><b>${name}</b></a>`
        ctx.replyWithHTML(result);
      });
    };

  } catch (e) {
    ctx.reply('Вы неправильно ввели город, для получения списка городов используй команду /help');
  }
});

bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.launch()


