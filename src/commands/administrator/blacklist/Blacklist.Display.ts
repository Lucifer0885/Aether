import type CustomClient from "@base/classes/CustomClient";
import SubCommand from "@base/classes/SubCommand";
import Blacklist from "@base/schemas/Blacklist";
import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";

export default class BlacklistDisplay extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "blacklist.display",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      let guild = await Blacklist.findOne({ guildId: interaction.guildId });

      if (!guild || guild.words.length < 1) {
        return interaction.editReply({
          content: "There are no words in the blacklist",
        });
      }

      const words = guild.words.map((word) => `> Word: \`${word.word}\` | Level: \`${word.level}\``).join("\n");

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Blacklist Display")
            .setDescription(words)
            .setTimestamp()
            .setFooter({
              text: `Actioned by ${interaction.user.tag} |  ${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({ size: 64 }),
            }),
        ],
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "An error occurred while displaying the blacklist",
      });
    }
  }
}