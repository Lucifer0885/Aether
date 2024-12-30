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

export default class TimeoutAdd extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "timeout.add",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getMember("user") as GuildMember;
    const duration = interaction.options.getInteger("duration") || 300;
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");

    const durationMap = new Map<number, string>([
      [60, "1 Minute"],
      [300, "5 Minutes"],
      [600, "10 Minutes"],
      [900, "15 Minutes"],
      [1800, "30 Minutes"],
      [3600, "1 Hour"],
      [21600, "6 Hours"],
      [43200, "12 Hours"],
      [86400, "1 Day"],
      [259200, "3 Days"],
      [604800, "1 Week"],
      [1209600, "2 Weeks"],
      [1814400, "3 Weeks"],
    ]);

    const durationName = durationMap.get(duration);

    if (!user) {
      errorEmbed.setDescription("❌ You must provide a valid user!");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (user.id === interaction.user.id) {
      errorEmbed.setDescription("❌ Why you wanna timeout yourself?");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (
      user.roles.highest.position >=
      (interaction.member?.roles as GuildMemberRoleManager).highest.position
    ) {
      errorEmbed.setDescription(
        "❌ You can't timeout a user with a higher or equal role position!"
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (
      user.communicationDisabledUntil != null &&
      user.communicationDisabledUntil > new Date()
    ) {
      errorEmbed.setDescription(
        `❌ ${user} is already timed out until \`${user.communicationDisabledUntil}\``
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
              `You have been timed out in ${interaction.guild?.name} by ${interaction.member}

              **Duration:** \`${durationName}\` 
              **Reason:** \`${reason}\``
            )
            .setImage(interaction.guild?.iconURL()!),
        ],
      });
    } catch (error: unknown) {
      console.error("[ERROR] Failed to send DM to user!", error);
    }

    try {
      await user.timeout(duration * 1000, reason);
    } catch (error: unknown) {
      console.error("[ERROR] Failed to timeout user!\n", error);
      errorEmbed.setDescription("❌ Failed to timeout user");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(
            `✅ ${user} has been timed out for \`${durationName}\``
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
                name: `⏳ Member ${user.user.displayName}(${user.user.tag}) timed out!`,
              })
              .setDescription(
                `${user} - \`${user.id}\` has been timed out by ${
                  interaction.member
                }
                    **Expires:** <t:${((Date.now() + duration) / 1000).toFixed(
                      0
                    )}:F>
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
            .setAuthor({ name: `⏳ Time Out` })
            .setDescription(
              `⏳ ${user} - \`${user.id}\` has been timed out by ${
                interaction.member
              }
                    
                    **Reason:** \`${reason}\`
                    **Duration:** \`${durationName}\`
                    **Expires:** <t:${((Date.now() + duration) / 1000).toFixed(
                      0
                    )}:F>
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
