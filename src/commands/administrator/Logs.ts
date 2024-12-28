import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import Category from "@base/enums/Category";
import {
  Application,
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";

export default class Logs extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "logs",
      description: "Logs Command",
      category: Category.Administrator,
      default_member_permission: PermissionFlagsBits.Administrator,
      dm_permissions: false,
      cooldown: 3,
      options: [
        {
          name: "toggle",
          description: "Toggle Logs in the server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "log-type",
              description: "type of log to toggle",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                {
                  name: "Moderation",
                  value: "moderation",
                },
              ],
            },{
                name: "toggle",
                description: "Enable/Disable Logs",
                type: ApplicationCommandOptionType.Boolean,
                required: true,
            }
          ],
        },{
            name: "set",
            description: "Set the log channel for this server",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "log-type",
                description: "type of log to set",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                  {
                    name: "Moderation",
                    value: "moderation",
                  },
                ],
              },{
                  name: "channel",
                  description: "Channel to set the log channel",
                  type: ApplicationCommandOptionType.Channel,
                  required: true,
                  channel_types: [ChannelType.GuildText]
              }
            ],
          },
      ],
      dev: false,
    });
  }
}
