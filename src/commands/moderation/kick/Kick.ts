import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import GuildConfig from "@base/schemas/GuildConfig";
import Category from "@enums/Category";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  GuildMemberRoleManager,
  Message,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";

export default class Kick extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "kick",
      description: "Kick a use from the server",
      category: Category.Moderation,
      default_member_permission: PermissionFlagsBits.KickMembers,
      dm_permissions: false,
      cooldown: 3,
      options: [
        {
          name: "user",
          description: "User to kick",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "reason",
          description: "Reason for kick",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "silent",
          description: "Don't send a message to the channel",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
      dev: false,
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getMember("user") as GuildMember;
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");

    if (!user) {
      return interaction.reply({
        embeds: [errorEmbed.setDescription("❌ Please provide a valid user!")],
        ephemeral: true,
      });
    }

    if (user.id === interaction.user.id) {
      return interaction.reply({
        embeds: [errorEmbed.setDescription("❌ You can't kick yourself!")],
        ephemeral: true,
      });
    }

    if (!user.kickable) {
      return interaction.reply({
        embeds: [errorEmbed.setDescription("❌ I can't kick this user!")],
        ephemeral: true,
      });
    }

    if (
      user.roles.highest.position >=
      (interaction.member?.roles as GuildMemberRoleManager).highest.position
    ) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ You can't kick this user because it has a higher role than you!"
          ),
        ],
        ephemeral: true,
      });
    }

    if (user.id === this.client.user?.id) {
      return interaction.reply({
        embeds: [errorEmbed.setDescription("❌ I cannot kick myself!")],
        ephemeral: true,
      });
    }

    if (reason.length > 512) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ The reason must be less than 512 characters!"
          ),
        ],
        ephemeral: true,
      });
    }

    try {
      await user.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `👢 You have been **kicked** from ${interaction.guild?.name} by ${interaction.member}.
              If you think this is a mistake, please contact the server staff.
              
              **Reason:** ${reason}
            `
            )
            .setThumbnail(interaction.guild?.iconURL({ size: 64 })!),
        ],
      });
    } catch (error) {
      console.error(error);
    }

    try {
      await user.kick(reason);
    } catch (error) {
      console.error(error);
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Orange")
          .setDescription(`👢 Kicked ${user.user.tag} - \`${user.id}\``),
      ],
      ephemeral: true,
    });

    if (!silent) {
      (interaction.channel as TextChannel).send({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setThumbnail(user.displayAvatarURL({ size: 64 }))
            .setAuthor({
              name: `👢 ${user.user.tag} has been kicked`,
            })
            .setDescription(`**Reason:** ${reason}`)
            .setTimestamp()
            .setFooter({
              text: `Kicked by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ size: 64 }),
            }),
          ],
        })
        .then(async (msg: Message) => {
          await msg.react("👢");
        });
    }

    const guild = await GuildConfig.findOne({ guildId: interaction.guildId });

    if (
      guild &&
      guild.logs?.moderation?.enabled &&
      guild.logs?.moderation?.channelId
    ) {
      (
        (await interaction.guild?.channels.fetch(
          guild.logs.moderation.channelId
        )) as TextChannel
      ).send({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setThumbnail(user.displayAvatarURL())
            .setAuthor({ name: `👢 Kick` })
            .setDescription(`
              **User:** ${user.user.tag} - ${user.user.displayName} - ${user.id}
              **Reason:** ${reason}`)
            .setTimestamp()
            .setFooter({
              text: `Kicked by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ size: 64 }),
            }),
        ],
      })
    }
  }
}
