import type { Events } from "discord.js";
import type CustomClient from "@base/classes/CustomClient";

export default interface IEvent {
    client: CustomClient;
    name: Events;
    description: string;
    once: boolean;
}