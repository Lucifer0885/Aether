import type { ChatInputCommandInteraction } from "discord.js";
import type ISubCommand from "../interfaces/ISubCommand";
import type CustomClient from "./CustomClient";
import type ISubCommandOptions from "../interfaces/ISubCommandOptions";

export default class SubCommand implements ISubCommand{
    client: CustomClient;
    name: string;

    constructor(client: CustomClient, options: ISubCommandOptions){
        this.client = client;
        this.name = options.name;
    }
    
    Execute(interaction: ChatInputCommandInteraction): void {}
    }