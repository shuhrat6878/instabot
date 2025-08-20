import { Telegraf } from "telegraf";
import { instagramGetUrl } from "instagram-url-direct"; // Instagram uchun
import "dotenv/config.js";

const bot = new Telegraf(process.env.BOT_TOKEN);

const ADMIN = "@admiral6878";
const BOT_NAME = "InstaYuklaBot";

// /start komandasi
bot.start((ctx) =>
    ctx.reply(
        `👋 Assalomu alaykum, hurmatli ${ctx.from.first_name}!\n\n` +
        `📹 Menga Instagram video link yuboring.\n` +
        `Men sizga uni yuklab beraman 😍\n\n` +
        `👨🏻‍💻 Muammo bo'lsa adminga yozing: ${ADMIN}`
    )
);

// Text handler
bot.on("text", async (ctx) => {
    const url = ctx.message.text;

    try {
        if (url.includes("instagram.com")) {
            // Kutish xabarini yuboramiz
            const waitMsg = await ctx.reply(
                "⏳ Videoni yuklab olyapman...\n\nOzgina kutaolasizmi... 🙏"
            );

            // Chat action (upload_video effekti chiqadi)
            await ctx.sendChatAction("upload_video");

            // Instagramdan video link olish
            const result = await instagramGetUrl(url);
            if (!result?.url_list?.length) {
                await ctx.deleteMessage(waitMsg.message_id); // kutish xabarini o‘chiramiz
                return ctx.reply("❌ Video topilmadi yoki profil private bo‘lishi mumkin.");
            }

            const videoUrl = result.url_list[0];

            // Video yuborish
            await ctx.replyWithVideo(
                { url: videoUrl },
                {
                    caption:
                        `✅ Video tayyor!\n\n` +
                        `🤖 Bot nomi: ${BOT_NAME}\n` +
                        `📦 Faqat Instagram videolarini yuklab oling.\n\n` +
                        `👨🏻‍💻 Admin: ${ADMIN}`,
                }
            );

            // Kutish xabarini avtomatik o‘chirish
            await ctx.deleteMessage(waitMsg.message_id);
            return;
        }

        ctx.reply("❌ Iltimos, faqat Instagram videolar linkini yuboring ☹️");
    } catch (err) {
        console.error(err);
        ctx.reply("⚠️ Xatolik bo'ldi, qayta urinib ko'ring.");
    }
});

bot.launch().then(() => console.log("🤖 Bot ishlamoqda..."));
