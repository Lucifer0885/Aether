import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import type CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Test extends Command{
    constructor(client: CustomClient){
        super(client, {
            name: "test",
            description: "Test Command",
            category: Category.Utilities,
            default_member_permission: PermissionFlagsBits.UseApplicationCommands,
            dm_permissions: false,
            cooldown: 3,
            options: [
                {
                    name: "one",
                    description: "Test One",
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    name: "two",
                    description: "Test Two",
                    type: ApplicationCommandOptionType.Subcommand
                }
            ],
            dev: false
        });
    }

    // Execute(interaction: ChatInputCommandInteraction): void {
    //     interaction.reply({ content: "Test Command Executed!", ephemeral: true });
    // }
}