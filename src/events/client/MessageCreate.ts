import type CustomClient from "@base/classes/CustomClient";
import Event from "@base/classes/Event";
import GuildConfig from "@base/schemas/GuildConfig";
import { EmbedBuilder, Events, Message, TextChannel } from "discord.js";

export default class MessageCreate extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.MessageCreate,
      description: "Message Create Event",
      once: false,
    });
  }

  async Execute(message: Message) {
    const user = message.author;
    const messageCtx = message.content.toLowerCase();
    const channel = message.channel as TextChannel;
    const guild = await GuildConfig.findOne({ guildId: message.guild?.id });
    
    const badWords = new Array<string>("badword1", "badword2", "badword3");
    
    if (user.bot) return;

    if (messageCtx === "!help") {
      try {
        await channel.send(`I'm here to help you!`);
      } catch (error: unknown) {
        console.error(`[ERROR] There was an error sending the message!`, error);
      }
    }

    if (badWords.some((word) => message.content.toLowerCase().includes(word))) {
      try {
        await user.send(`I'm watching you 👀`);
      } catch (error: unknown) {
        console.error(
          `[ERROR] There was an error sending the DM to the user!`,
          error
        );
      }

      try {
        await message.delete();
      } catch (error: unknown) {
        console.error(
          `[ERROR] There was an error deleting the message!`,
          error
        );
      }

      if (
        guild &&
        guild?.logs.moderation.enabled &&
        guild.logs.moderation.channelId
      ) {
        const logChannel = message.guild?.channels.cache.get(
          guild.logs.moderation.channelId
        ) as TextChannel;
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("Message Deleted")
              .setAuthor({ name: `🚨 ${user.displayAvatarURL()}${user.tag} hit a flagged word!`})
              .setThumbnail(message.guild?.iconURL({ size: 64})!)
              .setDescription(`
                **Message Author:** ${user.tag} | ${user.id} | ${user.displayName}
                **Channel:** ${channel.name}
                **Message Content:** ${message.content}`)
              .setTimestamp()
              .setFooter({ text: `User ID: ${user.id} User Tag: ${user.tag}` }),
          ],
        });
      }
    }
  }
}
