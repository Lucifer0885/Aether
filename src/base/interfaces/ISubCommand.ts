import type { ChatInputCommandInteraction } from "discord.js";
import type CustomClient from "../classes/CustomClient";

export default interface ISubCommand {
    client: CustomClient;
    name: string;

    Execute(interaction: ChatInputCommandInteraction): void;
}