import express from "express";
import { Telegraf } from "telegraf";
import { instagramGetUrl } from "instagram-url-direct";
import "dotenv/config.js";

const app = express();
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
            const waitMsg = await ctx.reply("⏳ Videoni yuklab olyapman...");

            await ctx.sendChatAction("upload_video");
            const result = await instagramGetUrl(url);

            if (!result?.url_list?.length) {
                await ctx.deleteMessage(waitMsg.message_id);
                return ctx.reply("❌ Video topilmadi yoki profil private bo‘lishi mumkin.");
            }

            const videoUrl = result.url_list[0];
            await ctx.replyWithVideo(
                { url: videoUrl },
                {
                    caption: `✅ Video tayyor!\n\n🤖 Bot nomi: ${BOT_NAME}\n👨🏻‍💻 Admin: ${ADMIN}`,
                }
            );

            await ctx.deleteMessage(waitMsg.message_id);
            return;
        }
        ctx.reply("❌ Iltimos, faqat Instagram videolar linkini yuboring ☹️");
    } catch (err) {
        console.error(err);
        ctx.reply("⚠️ Xatolik bo'ldi, qayta urinib ko'ring.");
    }
});

// === Webhook sozlamalari ===
app.use(bot.webhookCallback("/telegram"));

const PORT = process.env.PORT || 3000;
const URL = process.env.RENDER_EXTERNAL_URL; // Render dagi domen

bot.telegram.setWebhook(`${URL}/telegram`);

app.listen(PORT, () => {
  console.log(`✅ Server ishlayapti: ${PORT}`);
});
