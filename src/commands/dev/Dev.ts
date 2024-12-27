import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import type CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Dev extends Command{
    constructor(client: CustomClient){
        super(client, {
            name: "dev",
            description: "Dev Command",
            category: Category.Utilities,
            default_member_permission: PermissionFlagsBits.Administrator,
            dm_permissions: false,
            cooldown: 3,
            options: [],
            dev: true
        });
    }

    Execute(interaction: ChatInputCommandInteraction): void {
        interaction.reply({ content: "Test Command Executed!", ephemeral: true });
    }
}