import SubCommand from "@base/classes/SubCommand";
import type CustomClient from "@base/classes/CustomClient";
import {
  EmbedBuilder,
  GuildMemberRoleManager,
  Message,
  TextChannel,
  type ChatInputCommandInteraction,
  type GuildMember,
} from "discord.js";
import GuildConfig from "@base/schemas/GuildConfig";

export default class TimeoutRemove extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "timeout.remove",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getMember("user") as GuildMember;
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");

    if (!user) {
      errorEmbed.setDescription("❌ You must provide a valid user!");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (user.id === interaction.user.id) {
      errorEmbed.setDescription("❌ You cannot remove a timeout from yourself!");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (
      user.roles.highest.position >=
      (interaction.member?.roles as GuildMemberRoleManager).highest.position
    ) {
      errorEmbed.setDescription(
        "❌ You can't remove a timeout from a user with a higher or equal role position!"
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (user.communicationDisabledUntil == null) {
      errorEmbed.setDescription(
        `❌ ${user} isn't currently timed out!`
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (reason.length > 512) {
      errorEmbed.setDescription(
        "❌ The reason must be less than 512 characters"
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      await user.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription(
              `Your time out in ${interaction.guild?.name} was removed by ${interaction.member}
 
              **Reason:** \`${reason}\``
            )
            .setImage(interaction.guild?.iconURL()!),
        ],
      });
    } catch (error: unknown) {
      console.error("[ERROR] Failed to send DM to user!", error);
    }

    try {
      await user.timeout(null , reason);
    } catch (error: unknown) {
      console.error("[ERROR] Failed to remove the timeout from the user!", error);
      errorEmbed.setDescription("❌ Failed to remove the timeout from the user! Please try again!");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(
            `✅ Removed time out from ${user} - \`${user.id}\`!`
          ),
      ],
      ephemeral: true,
    });

    if (!silent) {
      (interaction.channel as TextChannel)
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setThumbnail(user.displayAvatarURL({ size: 64 }))
              .setAuthor({
                name: `⏳ Time out from member ${user.user.displayName}(${user.user.tag}) has been removed!`,
              })
              .setDescription(
                `Time out from ${user} - \`${user.id}\` has been removed by ${
                  interaction.member
                }
                    **Reason:** \`${reason}\`
                  `
              )
              .setTimestamp()
              .setFooter({
                text: `Actioned by ${interaction.user.tag} |  ${interaction.user.id}`,
                iconURL: interaction.user.displayAvatarURL({ size: 64 }),
              }),
          ],
        })
        .then(async (msg: Message) => {
          await msg.react("⏳");
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
            .setColor("Blue")
            .setThumbnail(user.displayAvatarURL({ size: 64 }))
            .setAuthor({ name: `⏳ Time Out Removed` })
            .setDescription(
              `⏳Time out from member ${user} - \`${user.id}\` has been removed by ${
                interaction.member
              }
                    
              **Reason:** \`${reason}\`
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
