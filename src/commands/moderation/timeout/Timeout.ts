import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import Category from "@base/enums/Category";
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

export default class Timeout extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "timeout",
      description: "Manage a timeout",
      category: Category.Moderation,
      cooldown: 3,
      default_member_permission: PermissionFlagsBits.MuteMembers,
      dm_permissions: false,
      dev: false,
      options:[
        {
          name: "add",
          description: "Add a timeout (Default duration is 5 minutes)",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to timeout",
              type: ApplicationCommandOptionType.User,
              required: true
            },
            {
              name: "duration",
              description: "The duration of the timeout",
              type: ApplicationCommandOptionType.Integer,
              required: false,
              choices: [
                { name: "1 Minute", value: 60 },
                { name: "5 Minutes", value: 300 },
                { name: "10 Minutes", value: 600 },
                { name: "15 Minutes", value: 900 },
                { name: "30 Minutes", value: 1800 },
                { name: "1 Hour", value: 3600 },
                { name: "6 Hours", value: 21600 },
                { name: "12 Hours", value: 43200 },
                { name: "1 Day", value: 86400 },
                { name: "3 Days", value: 259200 },
                { name: "1 Week", value: 604800 },
                { name: "2 Weeks", value: 1209600 },
                { name: "3 Weeks", value: 1814400 },
              ]
            },
            {
              name: "reason",
              description: "The reason for the timeout",
              type: ApplicationCommandOptionType.String,
              required: false
            },
            {
              name: "silent",
              description: "Don't send a message to the channel",
              type: ApplicationCommandOptionType.Boolean,
              required: false
            }
          ]
        },
        {
          name: "remove",
          description: "Remove a timeout",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to remove the timeout from",
              type: ApplicationCommandOptionType.User,
              required: true
            },
            {
              name: "reason",
              description: "The reason for removing the timeout",
              type: ApplicationCommandOptionType.String,
              required: false
            },
            {
              name: "silent",
              description: "Don't send a message to the channel",
              type: ApplicationCommandOptionType.Boolean,
              required: false
            }
          ]
        }
      ]
    });
  }
}