import type CustomClient from "@base/classes/CustomClient";
import SubCommand from "@base/classes/SubCommand";
import GuildConfig from "@base/schemas/GuildConfig";
import {
  EmbedBuilder,
  GuildMemberRoleManager,
  TextChannel,
  type ChatInputCommandInteraction,
  type GuildMember,
} from "discord.js";

export default class BanAdd extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "ban.add",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getMember("user") as GuildMember;
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const days: number = interaction.options.getInteger("days") || 0;
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");

    if (!user) {
      return interaction.reply({
        embeds: [errorEmbed.setDescription("❌ User not found")],
        ephemeral: true,
      });
    }

    if (user.id === interaction.user.id) {
      return interaction.reply({
        embeds: [errorEmbed.setDescription("❌ You can't ban yourself")],
        ephemeral: true,
      });
    }

    if (
      user.roles.highest.position >=
      (interaction.member!.roles as GuildMemberRoleManager).highest.position
    ) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ You can't ban a user with higher or equal roles than you!"
          ),
        ],
        ephemeral: true,
      });
    }

    if (!user.bannable) {
      return interaction.reply({
        embeds: [errorEmbed.setDescription("❌ This user can't be banned!")],
        ephemeral: true,
      });
    }

    if (reason.length > 512) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ Reason is too long! It can be up to 512 characters"
          ),
        ],
        ephemeral: true,
      });
    }

    try {
      await user.send({
        embeds: [
          new EmbedBuilder().setColor("Red").setDescription(
            `🔨You have been banned from \`${interaction.guild?.name}\` by ${interaction.member}
              
              **Reason:** \`${reason}\``
          ),
        ],
      });
    } catch (error) {
      console.log("Failed to send DM to user");
      console.error(error);
    }

    try {
      await user.ban({ deleteMessageSeconds: days, reason: reason });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ An error occurred while banning the user"
          ),
        ],
        ephemeral: true,
      });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription(`🔨 Banned ${user} - \`${user.id}\` from the server`),
      ],
      ephemeral: true,
    });

    if (!silent) {
      (interaction.channel as TextChannel)
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setThumbnail(user.user.displayAvatarURL({ size: 64 }))
              .setAuthor({ name: `🔨 Member ${user.user.displayName}(${user.user.tag}) Banned!` })
              .setDescription(
                `${user} - \`${user.id}\` has been banned by ${
                  interaction.member
                }
              
              **Reason:** \`${reason}\`
              ${
                days == 0
                  ? ""
                  : `This user's messages from the last ${
                      days / 60 / 60
                    } hours have been deleted`
              }
              `
              )
              .setTimestamp()
              .setFooter({ text: `Actioned by ${interaction.user.tag} |  ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ size: 64 }) }),
          ],
        })
        .then(async (msg: any) => {
          await msg.react("🔨");
        });
    }

    const guild = await GuildConfig.findOne({ guildId: interaction.guildId });

    if (
      guild &&
      guild?.logs?.moderation?.enabled &&
      guild?.logs?.moderation?.channelId
    ) {
      (
        (await interaction.guild?.channels.fetch(
          guild.logs.moderation.channelId
        )) as TextChannel
      ).send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setThumbnail(user.user.displayAvatarURL({ size: 64 }))
            .setAuthor({ name: `🔨 Ban` })
            .setDescription(
              `🔨 ${user} - \`${user.id}\` has been banned by ${
                interaction.member
              }
                
                **Reason:** \`${reason}\`
                ${
                  days == 0
                    ? ""
                    : `This user's messages from the last ${
                        days / 60 / 60
                      } hours have been deleted`
                }
                `
            )
            .setTimestamp()
            .setFooter({
              text: `Actioned by ${interaction.user.tag} |  ${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({ size: 64 }),
            }),
        ],
      });
    }
  }
}
