import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import Category from "@base/enums/Category";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  type ImageURLOptions,
} from "discord.js";

export default class Avatar extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "avatar",
      description: "Display the avatar of a user",
      category: Category.Utilities,
      dm_permissions: false,
      dev: false,
      cooldown: 5,
      default_member_permission: PermissionFlagsBits.UseApplicationCommands,
      options: [
        {
          name: "user",
          description:
            "The user you want to view the avatar of - defaults to yourself",
          required: false,
          type: ApplicationCommandOptionType.User,
        },
        {
          name: "size",
          description: "The size of the avatar to display - defaults to 512",
          required: false,
          type: ApplicationCommandOptionType.Integer,
          choices: [
            { name: "128x128", value: 128 },
            { name: "256x256", value: 256 },
            { name: "512x512", value: 512 },
          ],
        },
        {
          name: "silent",
          description: "Whether to send the avatar silently",
          required: false,
          type: ApplicationCommandOptionType.Boolean,
        },
      ],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const user = (interaction.options.getMember("user") ||
      interaction.member) as GuildMember;
    const silent = interaction.options.getBoolean("silent") || false;
    const size = (interaction.options.getInteger("size") ||
      512) as ImageURLOptions["size"];

    const checkIfEndsInS = (word: string) => word.endsWith("s");

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setAuthor({
            name: `${checkIfEndsInS(user.user.tag) ? `${user.user.tag}'` : `${user.user.tag}'s`} Avatar`,
            iconURL: user.user.displayAvatarURL(),
          })
          .setImage(user.user.displayAvatarURL({ size }))
          .setTimestamp()
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          }),
      ],
    ephemeral: silent,});
  }
}
