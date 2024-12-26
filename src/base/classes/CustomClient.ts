import { Client, Collection } from "discord.js";
import { TOKEN } from "../../../data/constants";
import Handler from "./Handler";
import type Command from "./Command";
import type SubCommand from "./SubCommand";

export default class CustomClient extends Client {
    handler: Handler
    commands: Collection<string, Command>;
    subCommands: Collection<string, SubCommand>;
    cooldowns: Collection<string, Collection<string, number>>;

    constructor(){
        super({ intents: [] });

        this.handler = new Handler(this);
        this.commands = new Collection();
        this.subCommands = new Collection();
        this.cooldowns = new Collection();
    }

    init(): void {
        this.LoadHandlers();
        this.login(TOKEN).catch((err) => {console.error(err)});
    }

    LoadHandlers(): void {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
    }

}