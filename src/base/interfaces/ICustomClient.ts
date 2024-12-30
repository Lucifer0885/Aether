import type { Collection } from "discord.js";
import type Command from "@base/classes/Command";
import type SubCommand from "@base/classes/SubCommand";

export default interface ICustomClient {
    commands: Collection<string, Command>;
    subCommands: Collection<string, SubCommand>;
    cooldowns: Collection<string, Collection<string, number>>;
    developmentMode: boolean;

    init(): void;
    LoadHandlers(): void;
}