import type CustomClient from "@base/classes/CustomClient";
import SubCommand from "@base/classes/SubCommand";
import GuildConfig from "@base/schemas/GuildConfig";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  type TextChannel,
} from "discord.js";

export default class LogsToggle extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "logs.toggle",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const logType = interaction.options.getString("log-type");
    const enabled = interaction.options.getBoolean("toggle");

    await interaction.deferReply({ ephemeral: true });

    try {
        let guild = await GuildConfig.findOne({ guildId: interaction.guildId });

        if (!guild) {
          guild = new GuildConfig({ guildId: interaction.guildId, guildName: interaction.guild?.name });
        }

        // @ts-ignore
        guild.logs[`${logType}`].enabled = enabled;
        
        await guild.save();

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setDescription(`✅ ${enabled ? "Enabled" : "Disabled"} the \`${logType}\` log`),
          ],
        });

    } catch (error) {
      console.error(error);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ An error occurred while updating the database"),
        ],
      });
    }
  }
}
