import { config } from "dotenv";
import { log } from "console";
config();
import {  join, resolve } from "path";
import { Telegraf,Markup } from "telegraf";


const bot = new Telegraf(String(process.env.BOT_TOKEN));
const filePath = join(process.cwd(),"menu.png")



const ovqatlar =[
    {
        id:1,
        name: "osh",
        image: resolve("./osh.jpeg")
    },{
        id: 2,
        name: 'norin',
        image: resolve("./norin.jpeg")
    },
    {
        id: 3,
        name: 'shorba',
        image: resolve("./shorva.jpeg")
    },
    {
        id: 4,
        name: 'lagmon',
        image: resolve("./lagmon.jpeg")
    },
    {
        id: 5,
        name: 'moshkichiri',
        image: resolve("./moshkichiri.jpeg")
    },
    {
        id: 6,
        name: 'chuchvara',
        image: resolve("./chuchvara.jpeg")
    }
]
const baseKeyboards = [
    'Menu', 'Biz haqimizda', 'Sozlamalar', 'Savat'
];

bot.start((ctx)=> {
    return ctx.reply(`Assalomu aleykum hurmatli -${ctx.message.from.first_name}`,
        Markup.keyboard([
        [...baseKeyboards.slice(0,2)],
        [...baseKeyboards.slice(2)]
    ]).resize()
    );
});
bot.hears(baseKeyboards, ctx => {
    if (ctx.message?.text === 'Biz haqimizda') {
        return ctx.replyWithPhoto({ source: filePath }, {
            caption: 'Bu botda siz ovqat buyurtma qilishingiz mumkin'
        });
    }

    if (ctx.message?.text === 'Menu') {
        for (let i of ovqatlar) {
            ctx.replyWithPhoto({ source: i.image }, {
                caption: i.name,
                ...Markup.inlineKeyboard([
                    [Markup.button.callback(`Savatga qo'shish`, `cart_${i.id}`)]
                ])
            }
            );
        }
    }

    if (ctx.message?.text === 'Savat') {
        const cartItems = carts[userId] || [];
        if (cartItems.length === 0) {
            return ctx.reply("Savat bo'sh 🛒");
        }
        let msg = "🛒 Sizning savatingiz:\n";
        cartItems.forEach((item, idx) => {
            msg += `${idx + 1}. ${item.name}\n`;
        });
        ctx.reply(msg);
    }
});

bot.on('callback_query', ctx => {
    const userId = ctx.from.id;
    const data = ctx.callbackQuery.data;

    if (data.startsWith('cart_')) {
        const foodId = Number(data.split('_')[1]);
        const food = ovqatlar.find(o => o.id === foodId);
        if (!food) return;

        if (!carts[userId]) {
            carts[userId] = [];
        }
        carts[userId].push(food);

        ctx.answerCbQuery(`${food.name} savatga qo'shildi ✅`, { show_alert: false });
    }
});

bot.help((ctx)=>{
    return ctx.reply("Xatolik kelib chiqsa va yordam kerak bolsa @admiral6878 ga murojat qilin")
})

bot.launch();
console.log("Botimiz ishlamoqda....");
