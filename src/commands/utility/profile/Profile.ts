import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import Category from "@base/enums/Category";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";

export default class Profile extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "profile",
      description: "View a user's profile",
      category: Category.Utilities,
      default_member_permission: PermissionFlagsBits.UseApplicationCommands,
      dm_permissions: false,
      dev: false,
      cooldown: 5,
      options: [
        {
          name: "user",
          description: "The user you want to view the profile of",
          type: ApplicationCommandOptionType.User,
          required: false,
        },
      ],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const user = (interaction.options.getMember("user") ||
      interaction.member) as GuildMember;
    const roles = user.roles.cache.map((r) => r.toString()).join(", ");
    const boostingSince = user.premiumSince?.toLocaleString() || "Not boosting";

    await interaction.deferReply({ ephemeral: true });
    
    const profileEmbed = new EmbedBuilder()
      .setColor("Random")
      .setAuthor({
        name: `${user.user.tag}'s Profile`,
        iconURL: user.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.guild?.iconURL() as string)
      .setDescription(`
        **User:** \`${user.user.displayName}\` - \`${user.user.tag}\` - \`${user.user.id}\`
        **Joined Discord:** ${user.user.createdAt.toLocaleString()}
        **Member Since:** ${user.joinedAt?.toLocaleString()}
        **Roles:** ${roles}
        **Boosting Since:** ${boostingSince}
        `)
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    interaction.editReply({ embeds: [profileEmbed] });
  }
}
