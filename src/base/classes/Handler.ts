import type IHandler from "@base/interfaces/IHandler";
import path from "path";
import type CustomClient from "@base/classes/CustomClient";
import Event from "@base/classes/Event";
import { glob } from "glob";
import type Command from "@base/classes/Command";
import type SubCommand from "@base/classes/SubCommand";

export default class Handler implements IHandler{
    client: CustomClient;

    constructor(client: CustomClient){
        this.client = client;
    }

    async LoadEvents() {
        const files = (await glob(`src/events/**/*.ts`)).map((file) => path.resolve(file));
    
        files.map(async (file: string) => {
            const event: Event = new (await import(file)).default(this.client);
    
            if (!event.name) {
                return delete require.cache[require.resolve(file)] && console.log(`${file} has no name property.`);
            }
    
            const execute = (...args: any) => event.Execute(...args);

            // @ts-ignore
            if (event.once) this.client.once(event.name, execute);
            // @ts-ignore
            else this.client.on(event.name, execute);

    
            return delete require.cache[require.resolve(file)];
        });
    }

    async LoadCommands() {
        const files = (await glob(`src/commands/**/*.ts`)).map((file) => path.resolve(file));
    
        files.map(async (file: string) => {
            const command: Command | SubCommand = new (await import(file)).default(this.client);
    
            if (!command.name) {
                return delete require.cache[require.resolve(file)] && console.log(`${file} has no name property.`);
            }
    
            if(file.split("/").pop()?.split(".")[2]){
                return this.client.subCommands.set(command.name, command);
            }

            this.client.commands.set(command.name, command as Command);
    
            return delete require.cache[require.resolve(file)];
        });
    }

}