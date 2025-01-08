import type CustomClient from "@base/classes/CustomClient";
import SubCommand from "@base/classes/SubCommand";
import type WarnLevel from "@base/enums/WarnLevel";
import Blacklist from "@base/schemas/Blacklist";
import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";

export default class BlacklistAdd extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "blacklist.add",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const word = interaction.options.getString("word");
    const level = (interaction.options.getString("level") || "calm") as WarnLevel;

    await interaction.deferReply({ ephemeral: true });

    try {
      let guild = await Blacklist.findOne({ guildId: interaction.guildId });

      if (!guild) {
        guild = new Blacklist({
          guildId: interaction.guildId,
          words: [],
        });
      }

      guild.words.push({ word: word!, level: level! });

      await guild.save();

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle("Blacklist Add")
            .setDescription(`✅ Successfully added the word \`${word}\` to the blacklist with a level of \`${level}\``)
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
        content: "An error occurred while adding the word to the blacklist",
      });
    }
  }
}
