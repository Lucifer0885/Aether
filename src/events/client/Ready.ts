import { Collection, Events, REST, Routes } from "discord.js";
import type CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import type Command from "../../base/classes/Command";
import { TOKEN, CLIENT_ID, DEV_SERVER } from "../../../data/constants";

export default class Ready extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description: "This event is triggered when the client is ready.",
            once: true
        });
    }
    async Execute() {
        console.log(`Logged in as ${this.client.user?.tag}!`);

        const commands: object[] = this.GetJson(this.client.commands)

        const rest = new REST().setToken(TOKEN as string);

        const setCommands: any = await rest.put(Routes.applicationGuildCommands(CLIENT_ID as string, DEV_SERVER as string), { body: commands });

        console.log(`Successfully registered ${setCommands.length} application command(s)`);
    }

    private GetJson(commands: Collection<string, Command>): object[] {
        const data: object[] = [];

        commands.forEach((command: Command) => {
            data.push({
                name: command.name,
                description: command.description,
                options: command.options,
                default_member_permission: command.default_member_permission.toString(),
                dm_permissions: command.dm_permissions
            });
        });
        
        return data;
    } 
}