import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import Category from "@base/enums/Category";
import { ChatInputCommandInteraction, Collection, EmbedBuilder, PermissionFlagsBits } from "discord.js";

export default class Help extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "help",
      description: "Display a list of commands",
      category: Category.Utilities,
      cooldown: 3,
      default_member_permission: PermissionFlagsBits.UseApplicationCommands,
      dm_permissions: false,
      dev: false,
      options:[]
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const commands: Collection<string,Command> = this.client.commands;

    const embed = new EmbedBuilder()
      .setColor("Purple")
      .setTitle("Command List")
      .setDescription(commands.map(cmd => `**${cmd.name}** - ${cmd.description}`).join("\n"))
      .setFooter({ text: `Total Commands: ${commands.size}`})
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
}