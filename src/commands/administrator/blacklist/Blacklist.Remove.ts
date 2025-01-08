import type CustomClient from "@base/classes/CustomClient";
import SubCommand from "@base/classes/SubCommand";
import Blacklist from "@base/schemas/Blacklist";
import type { ChatInputCommandInteraction } from "discord.js";

export default class BlacklistRemove extends SubCommand{
  constructor(client: CustomClient) {
    super(client, {
      name: "blacklist.remove",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const word = interaction.options.getString("word");

    await interaction.deferReply({ ephemeral: true });

    try {
      let guild = await Blacklist.findOne({ guildId: interaction.guildId });

      if (!guild || guild.words.length < 1) {
        return interaction.editReply({
          content: "There are no words in the blacklist",
        });
      }

      const index = guild.words.findIndex((w) => w.word === word);

      if (index === -1) {
        return interaction.editReply({
          content: `The word \`${word}\` is not in the blacklist`,
        });
      }

      guild.words.splice(index, 1);

      await guild.save();

      interaction.editReply({
        content: `✅ Successfully removed the word \`${word}\` from the blacklist`,
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "An error occurred while removing the word from the blacklist",
      });
    }
  }
}