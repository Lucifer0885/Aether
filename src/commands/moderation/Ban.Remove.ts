import type CustomClient from "@base/classes/CustomClient";
import SubCommand from "@base/classes/SubCommand";
import GuildConfig from "@base/schemas/GuildConfig";
import {
  EmbedBuilder,
  GuildMemberRoleManager,
  Message,
  TextChannel,
  type ChatInputCommandInteraction,
  type GuildMember,
} from "discord.js";

export default class BanRemove extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "ban.remove",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getString("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");
   
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
        await interaction.guild?.bans.fetch(user!);
    } catch (error) {
      console.error(error);
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ This user is not banned!"
          ),
        ],
        ephemeral: true,
      });   
        
    }

    try {
      await interaction.guild?.bans.remove(user!, reason);
    } catch (error) {
      console.error(error);
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ An error occurred while unbanning the user"
          ),
        ],
        ephemeral: true,
      });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(`✅ Unbanned <@${user}> - \`${user}\``),
      ],
      ephemeral: true,
    });

    if (!silent) {
      (interaction.channel as TextChannel)
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setAuthor({ name: `✅ Unban ${user}!` })
              .setDescription(
                `✅ Ban for user <@${user}> - \`${user}\` has been been revoked by ${
                  interaction.member
                }
              
              **Reason:** \`${reason}\`
              `
              )
              .setTimestamp()
          ],
        })
        .then(async (msg: Message) => {
          await msg.react("✅");
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
            .setColor("Green")
            .setAuthor({ name: `✅ Unban` })
            .setDescription(
                `✅ Ban for user <@${user}> - \`${user}\` has been been revoked by ${
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
