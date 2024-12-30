import Command from "@base/classes/Command";
import type CustomClient from "@base/classes/CustomClient";
import Category from "@enums/Category";
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

export default class Ban extends Command{
    constructor(client: CustomClient){
        super(client, {
            name: "ban",
            description: "Ban Command",
            category: Category.Moderation,
            default_member_permission: PermissionFlagsBits.BanMembers,
            dm_permissions: false,
            cooldown: 3,
            options: [
                {
                    name: "add",
                    description: "Select a user to ban",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "user",
                            description: "User to ban",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },{
                            name: "reason",
                            description: "Reason for ban",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },{
                            name: "days",
                            description: "Days of messages to delete",
                            type: ApplicationCommandOptionType.Integer,
                            required: false,
                            choices: [
                                {
                                    name: "None",
                                    value: 0
                                },{
                                    name: "1 Day",
                                    value: 86400
                                },{
                                    name: "7 Days",
                                    value: 604800
                                }
                            ]
                        },{
                            name: "silent",
                            description: "Don't send a message to the channel",
                            type: ApplicationCommandOptionType.Boolean,
                            required: false
                        }
                    ]
                },{
                    name: "remove",
                    description: "User to unban",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "user",
                            description: "Enter the user's id to unban",
                            type: ApplicationCommandOptionType.User,
                            required: true
                        },{
                            name: "reason",
                            description: "Reason for unban",
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },{
                            name: "silent",
                            description: "Don't send a message to the channel",
                            type: ApplicationCommandOptionType.Boolean,
                            required: false
                        }
                    ]
                }
            ],
            dev: false
        });
    }
}