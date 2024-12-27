import type CustomClient from "@base/classes/CustomClient";
import Event from "@base/classes/Event";
import GuildConfig from "@base/schemas/GuildConfig";
import { Events, Guild } from "discord.js";

export default class GuildDelete extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.GuildDelete,
            description: "This event is triggered when the bot leaves a guild.",
            once: false
        });
    }
   
    async Execute(guild: Guild) {
        try {
            await GuildConfig.deleteOne({ guildId: guild.id });
            console.log(`Left a guild!`);
        } catch (error) {
            console.error(error);
        }
    }
}