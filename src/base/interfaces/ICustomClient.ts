import type { Collection } from "discord.js";
import type IConfig from "./IConfig";
import type Command from "../classes/Command";
import type SubCommand from "../classes/SubCommand";

export default interface ICustomClient {
    commands: Collection<string, Command>;
    subCommands: Collection<string, SubCommand>;
    cooldowns: Collection<string, Collection<string, number>>;

    init(): void;
    LoadHandlers(): void;
}