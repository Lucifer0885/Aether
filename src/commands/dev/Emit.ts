import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import Category from "@enums/Category";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Events,
  Guild,
  PermissionFlagsBits,
} from "discord.js";

export default class Emit extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "emit",
      description: "Emit an event",
      dev: true,
      default_member_permission: PermissionFlagsBits.Administrator,
      dm_permissions: false,
      category: Category.Developer,
      cooldown: 1,
      options: [
        {
          name: "event",
          description: "The event to emit",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: "GuildCreate", value: Events.GuildCreate },
            { name: "GuildDelete", value: Events.GuildDelete },
          ],
        },
      ],
    });
  }

  Execute(interaction: ChatInputCommandInteraction): void {
    const event = interaction.options.getString("event");

    if (event === Events.GuildCreate || event === Events.GuildDelete) {
      this.client.emit(event, interaction.guild as Guild);
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(`Emitted event: ${event}`),
      ],
      ephemeral: true,
    });
  }
}
