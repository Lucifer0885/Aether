import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import Category from "@base/enums/Category";
import GuildConfig from "@base/schemas/GuildConfig";
import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";

export default class Slowmode extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "slowmode",
      description: "set the slowmode for a channel",
      category: Category.Moderation,
      cooldown: 3,
      default_member_permission: PermissionFlagsBits.ManageChannels,
      dm_permissions: false,
      dev: false,
      options: [
        {
          name: "rate",
          description: "Select the slowmode rate",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          choices: [
            { name: "None", value: 0 },
            { name: "5 Seconds", value: 5 },
            { name: "10 Seconds", value: 10 },
            { name: "15 Seconds", value: 15 },
            { name: "30 Seconds", value: 30 },
            { name: "1 Minute", value: 60 },
            { name: "2 Minutes", value: 120 },
            { name: "5 Minutes", value: 300 },
            { name: "10 Minutes", value: 600 },
            { name: "15 Minutes", value: 900 },
            { name: "30 Minutes", value: 1800 },
            { name: "1 Hour", value: 3600 },
            { name: "2 Hours", value: 7200 },
            { name: "6 Hours", value: 21600 },
          ],
        },
        {
          name: "channel",
          description: "Select the channel - Default is current channel",
          type: ApplicationCommandOptionType.Channel,
          required: false,
          channel_types: [ChannelType.GuildText],
        },
        {
          name: "reason",
          description: "Reason for setting the slowmode",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "silent",
          description: "Whether to send a response or not",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const rate = interaction.options.getInteger("rate")!;
    const channel = (interaction.options.getChannel("channel") ||
      interaction.channel) as TextChannel;
    const reason =
      interaction.options.getString("reason") || "No reason provided.";
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");

    if (rate < 0 || rate > 21600) {
      errorEmbed.setDescription(
        "⛔ Invalid slowmode rate. Please select a rate between 0 and 6 hours(21600 seconds)."
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
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
      channel.setRateLimitPerUser(rate, reason);
    } catch (error: unknown) {
      console.error(
        `[ERROR] There was an error setting the channel slowmode!`,
        error
      );
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ There was an error setting the channel slowmode!"
          ),
        ],
        ephemeral: true,
      });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `🕒 Slowmode has been set to ${rate} seconds in ${channel}.`
          ),
      ],
      ephemeral: true,
    });

    if (!silent) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setAuthor({
              name: `🕒 Slowmode | ${channel.name} - ${channel.id}`,
            })
            .setDescription(`
              **Reason:** ${reason}
              **Rate:** ${rate} seconds
              `)
            .setTimestamp()
            .setFooter({
              text: `Slowmode set by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ size: 64 }),
            }),
          ],
        })
        .then(async (msg: Message) => {
          await msg.react("🕒");
        });
    }

    const guild = await GuildConfig.findOne({ guildId: interaction.guildId });

    if(guild && guild.logs.moderation.enabled && guild.logs.moderation.channelId){
      (await interaction.guild?.channels.fetch(guild.logs.moderation.channelId) as TextChannel)?.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setAuthor({
              name: `🕒 Slowmode | ${channel.name} - ${channel.id}`,
            })
            .setDescription(`
              **Reason:** ${reason}
              **Rate:** ${rate} seconds
              `)
            .setTimestamp()
            .setFooter({
              text: `Slowmode set by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ size: 64 }),
            }),
          ],
        }).then(async (msg: Message) => {
          await msg.react("🕒");
        });
    }
  }
}
