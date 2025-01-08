import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import Category from "@base/enums/Category";
import { DEV_IDS, CLIENT_ID } from "@data/constants";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import os from "os";
const { version, dependencies } = require(`${process.cwd()}/package.json`);

export default class BotInfo extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "bot-info",
      description: "Fetch bot information",
      category: Category.Utilities,
      cooldown: 3,
      default_member_permission: PermissionFlagsBits.UseApplicationCommands,
      dm_permissions: false,
      dev: false,
      options: [],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setThumbnail(this.client.user?.displayAvatarURL()!).setDescription(`
        __**Bot Information**__
        > **Tag:** ${this.client.user?.tag}
        > **ID:** ${this.client.user?.id}
        > **Display Name:** ${this.client.user?.displayName}
        > **Joined Discord:** ${this.client.user?.createdAt.toLocaleString()}
        > **Guilds:** ${this.client.guilds.cache.size}
        > **Commands:** ${this.client.commands.size}
        
        __**System Information**__
        > **Operating System:** ${process.platform}
        > **CPU:** ${os.cpus()[0].model}
        > **Memory Usage:** ${(
          process.memoryUsage().heapUsed /
          1024 /
          1024
        ).toFixed(2)}MB
        > **Uptime:** ${(this.client.uptime! / 1000).toFixed(2)}s
        > **Ping:** ${Math.floor(this.client.ws.ping)}ms
        > **Version:** ${version}
        > **Bun.js Version:** ${process.version}
        > **Dependencies (${Object.keys(dependencies).length}):** ${Object.keys(
          dependencies
        )
          .map((p) => `${p}@${dependencies[p]}`.replace(/\^/g, ""))
          .join(", ")}
        
        __**Development**__
        > **Owner:** <@${DEV_IDS[0]}>
        > **Developers:** ${DEV_IDS.map((id) => `<@${id}>`).join(", ")}

        `),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("Invite Me !")
            .setStyle(ButtonStyle.Link)
            .setURL(
              `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&integration_type=0&scope=applications.commands+bot`
            )
        ),
      ],
    });
  }
}
