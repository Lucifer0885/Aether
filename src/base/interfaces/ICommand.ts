import type { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import type CustomClient from "@base/classes/CustomClient";
import type Category from "@base/enums/Category";

export default interface ICommand {
    client: CustomClient;
    name: string;
    description: string;
    category: Category;
    options: object;
    default_member_permission: bigint;
    dm_permissions: boolean;
    cooldown: number;
    dev: boolean;

    Execute(interaction: ChatInputCommandInteraction): void;
    Autocomplete(interaction: AutocompleteInteraction): void;
}