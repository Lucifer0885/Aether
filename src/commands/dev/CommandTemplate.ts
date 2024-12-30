import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import Category from "@base/enums/Category";
import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";

export default class DoNotExecute extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "template",
      description: "Command Template - DO NOT EXECUTE",
      category: Category.Moderation,
      cooldown: 3,
      default_member_permission: PermissionFlagsBits.MuteMembers,
      dm_permissions: false,
      dev: true,
      options:[]
    });
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    interaction.reply({ content: "This command is a template and should not be executed.", ephemeral: true });
  }
}