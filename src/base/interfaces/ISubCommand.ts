import type { ChatInputCommandInteraction } from "discord.js";
import type CustomClient from "@base/classes/CustomClient";

export default interface ISubCommand {
    client: CustomClient;
    name: string;

    Execute(interaction: ChatInputCommandInteraction): void;
}