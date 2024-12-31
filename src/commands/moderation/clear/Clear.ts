import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import Category from "@base/enums/Category";
import GuildConfig from "@base/schemas/GuildConfig";
import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  ChannelType,
  TextChannel,
  GuildMember,
  EmbedBuilder,
  Collection,
  Message,
} from "discord.js";

export default class Clear extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "clear",
      description: "Clear messages from a channel or user.",
      category: Category.Moderation,
      cooldown: 3,
      default_member_permission: PermissionFlagsBits.ManageMessages,
      dm_permissions: false,
      dev: false,
      options: [
        {
          name: "amount",
          description: "The amount of messages to clear. Max 100",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "user",
          description:
            "The user to clear messages from. Default is all messages.",
          type: ApplicationCommandOptionType.User,
          required: false,
        },
        {
          name: "channel",
          description:
            "The channel to clear messages from. Default is current channel.",
          type: ApplicationCommandOptionType.Channel,
          channel_types: [ChannelType.GuildText],
          required: false,
        },
        {
          name: "silent",
          description: "Whether to send a message in chat or not.",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    
    let amount = interaction.options.getInteger("amount") as number;
    const channel = (interaction.options.getChannel("channel") ||
    interaction.channel) as TextChannel;
    const user = interaction.options.getMember("user") as GuildMember;
    const silent = interaction.options.getBoolean("silent") || false;
    
    const errorEmbed = new EmbedBuilder().setColor("Red");
    if (amount > 100 || amount < 1) {
      errorEmbed.setDescription(
        " You can only clear between 1 and 100 messages at a time."
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const messages: Collection<
      string,
      Message<true>
    > = await channel.messages.fetch({ limit: amount });

    var filterMessages = user
      ? messages.filter((m) => m.author.id === user.user.id)
      : messages;
    let deleted = 0

    try {
      deleted = (await channel.bulkDelete(
        Array.from(filterMessages.keys()).slice(0, amount),
        true
      )).size;
    } catch (error) {
      console.error(
        `[ERROR] There was an error trying to delete messages!\n`,
        error
      );
      errorEmbed.setDescription(
        "❌ There was an error trying to delete messages!"
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Orange")
          .setDescription(
            `🧹 Successfully deleted ${deleted} messages${
              user ? ` from ${user}` : ""
            } in ${channel}.`
          ),
      ],
      ephemeral: true,
    });

    const checkIfEndsInS = (word: string) => word.endsWith("s");

    if (!silent) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setAuthor({
              name: `🧹 Clear | ${channel.name}`,
            })
            .setDescription(
              `🧹 **Deleted**: ${deleted} messages.
              
              ${user ? `${checkIfEndsInS(user.user.tag as string) ? `${user.user.tag}'` : `${user.user.tag}'s`}` : "All users'"} messages!
              `
            )
            .setTimestamp()
            .setFooter({
              text: `Actioned by ${interaction.user.tag} |  ${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({ size: 64 }),
            }),
        ],
      }).then(async (msg: Message) => msg.react("🧹"));
    }

    const guild = await GuildConfig.findOne({ guildId: interaction.guildId });

    if(guild && guild?.logs?.moderation?.enabled && guild?.logs?.moderation?.channelId) {
      (await interaction.guild?.channels.fetch(guild.logs.moderation.channelId) as TextChannel).send({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setAuthor({
              name: `🧹 Clear | ${channel.name}`,
            })
            .setDescription(
              `**Deleted**: ${deleted} messages.
              **Channel**: ${channel} - \`${channel.id}\`
              
              ${user ? `${checkIfEndsInS(user.user.tag as string) ? `${user.user.tag}'` : `${user.user.tag}'s`}` : "All users'"} messages!
              `
            )
            .setTimestamp()
            .setFooter({
              text: `Actioned by ${interaction.user.tag} |  ${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({ size: 64 }),
            }),
        ],
      }).then(async (msg: Message) => msg.react("🧹"))
    }
  }
}
