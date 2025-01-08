import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import Category from "@base/enums/Category";
import WarnLevel from "@base/enums/WarnLevel";
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

export default class Blacklist extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "blacklist",
      description: "Manage the blacklist",
      category: Category.Administrator,
      cooldown: 3,
      default_member_permission: PermissionFlagsBits.Administrator,
      dm_permissions: false,
      dev: false,
      options: [
        {
          name: "add",
          description: "Add a word to the blacklist",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "word",
              description: "The word to add",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
            {
              name: "level",
              description: "The warn level to assign - default is Calm",
              type: ApplicationCommandOptionType.String,
              required: false,
              choices: [
                {
                  name: WarnLevel.Calm,
                  value: "calm",
                },
                {
                  name: WarnLevel.Moderate,
                  value: "moderate",
                },
                {
                  name: WarnLevel.Severe,
                  value: "severe",
                },
              ],
            },
          ],
        },
        {
          name: "remove",
          description: "Remove a word from the blacklist",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "word",
              description: "The word to remove",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },
        {
          name: "display",
          description: "List all blacklisted words",
          type: ApplicationCommandOptionType.Subcommand,
          options: [],
        },
      ],
    });
  }
}