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
        {
          name: "silent",
          description: "Silently view the profile",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        }
      ],
    });
  }

  Execute(interaction: ChatInputCommandInteraction) {
    const user = (interaction.options.getMember("user") ||
      interaction.member) as GuildMember;
    const roles = user.roles.cache.map((r) => r).join(", ").replace("@everyone", "") || "None";
    const boostingSince = user.premiumSince?.toLocaleString() || "Not boosting";
    const silent = interaction.options.getBoolean("silent") || false;
    
    const profileEmbed = new EmbedBuilder()
      .setColor("Random")
      .setAuthor({
        name: `${user.user.tag}'s Profile`,
        iconURL: user.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.guild?.iconURL() as string)
      .setDescription(`
        __**User Information**__
        > **Tag:** ${user.user.tag}
        > **ID:** ${user.user.id}
        > **Display Name:** ${user.user.displayName}
        > **Bot:** ${user.user.bot ? "Yes" : "No"}
        > **Joined Discord:** ${user.user.createdAt.toLocaleString()}

        __**Member Information**__
        > **Member Since:** ${user.joinedAt?.toLocaleString()}
        > **Roles:** ${Profile.formatRoles(roles)}
        > **Boosting Since:** ${boostingSince}
        > **Admin:** ${user.permissions.has(PermissionFlagsBits.Administrator) ? "Yes" : "No"}
        `)
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    interaction.reply({ embeds: [profileEmbed], ephemeral: silent });
    }

  private static formatRoles(roles: string): string {
    roles.endsWith(", ") ? roles = roles.slice(0, -2) : roles;

    return roles;
  }
}
