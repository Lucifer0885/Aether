import type { Events } from "discord.js";
import type IEvent from "@base/interfaces/IEvent";
import type CustomClient from "@base/classes/CustomClient";
import type IEventOptions from "@base/interfaces/IEventOptions";

export default class Event implements IEvent{
    client: CustomClient;
    name: Events;
    description: string;
    once: boolean;

    constructor(client: CustomClient, options: IEventOptions){
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.once = options.once;
    }

    Execute(...args: any): void {}
}