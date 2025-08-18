import { Telegraf } from "telegraf";
import { instagramGetUrl } from "instagram-url-direct"; // Instagram uchun
import "dotenv/config.js";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
    ctx.reply(
        `👋 Assalomu alaykum hurmatli ${ctx.message.from.first_name}!\n\n` +
        `📹 Menga Instagram video link yuboring.\n` +
        `Men sizga uni tayyor qilib yuboraman 😍\n\n` +
        `👨🏻‍💻 Muammo bo‘lsa adminga yozing: @admiral6878`
    )
);

bot.on("text", async (ctx) => {
    const url = ctx.message.text;

    try {
        // ==== Instagram ====
        if (url.includes("instagram.com")) {
            await ctx.reply("⏳ Instagram videoni yuklab olyapman...\n\nOzgina kutaolasizmi...");

            const result = await instagramGetUrl(url);
            if (!result?.url_list?.length) {
                return ctx.reply("❌ Video topilmadi yoki profil private bolishi mumkin.");
            }

            const videoUrl = result.url_list[0];

            await ctx.replyWithVideo(
                { url: videoUrl },
                {
                    caption: `\n\n🤖 Bot nomi: VideoYuklaBot\n📦♻️ 📹 Menga Instagram video link yuboring.\n Men sizga uni tayyor qilib yuboraman 😍\n\n👨🏻‍💻 Muammo bo‘lsa adminga yozing: @admiral6878 \n@ogabek_boymirzayev`,
                }
            );
            return;
        }

        ctx.reply("❌ Iltimos, faqat Instagramdagi videolar linkni yuboring ☹️");
    } catch (err) {
        console.error(err);
        ctx.reply("⚠️ Xatolik bo‘ldi, qayta urinib ko‘ring.");
    }
});

bot.launch().then(() => console.log("🤖 Bot ishlamoqda..."));
console.log("Bot ishlamoqda......");

