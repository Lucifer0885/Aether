import { Client, Collection, GatewayIntentBits } from "discord.js";
import { TOKEN, DEV_TOKEN } from "@data/constants";
import Handler from "./Handler";
import type Command from "./Command";
import type SubCommand from "./SubCommand";
import type ICustomClient from "../interfaces/ICustomClient";
import MongoConnect from "@base/MongoConnect";

export default class CustomClient extends Client implements ICustomClient {
    handler: Handler
    commands: Collection<string, Command>;
    subCommands: Collection<string, SubCommand>;
    cooldowns: Collection<string, Collection<string, number>>;
    developmentMode: boolean;

    constructor(){
        super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

        this.handler = new Handler(this);
        this.commands = new Collection();
        this.subCommands = new Collection();
        this.cooldowns = new Collection();
        this.developmentMode = process.argv.slice(2).includes("--dev");
    }

    init(): void {
        console.log(`Initializing client...\nDevelopment mode: ${this.developmentMode}`);

        this.LoadHandlers();
        this.login(this.developmentMode ? DEV_TOKEN : TOKEN).catch((err: Error) => {console.error(err.message, err)});

        MongoConnect(this.developmentMode);
    }

    LoadHandlers(): void {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
    }

}