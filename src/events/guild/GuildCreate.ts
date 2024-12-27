import type CustomClient from "@base/classes/CustomClient";
import Event from "@base/classes/Event";
import GuildConfig from "@base/schemas/GuildConfig";
import { EmbedBuilder, Events, Guild } from "discord.js";

export default class GuildDelete extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.GuildCreate,
      description: "This event is triggered when the bot joins a guild.",
      once: false,
    });
  }

  async Execute(guild: Guild) {
    try {
      if (!(await GuildConfig.exists({ guildId: guild.id })))
        await GuildConfig.create({ guildId: guild.id, guildName: guild.name });
      console.log(`Joined a guild!`);
    } catch (error) {
      console.error(error);
    }

    const onwer = await guild.fetchOwner();
    onwer?.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `Hallo ${onwer.user.username}! Thank you for adding me to your server 😄`
          ),
      ],
    }).catch();
  }
}
