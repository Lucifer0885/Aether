import type CustomClient from "@base/classes/CustomClient";
import Event from "@base/classes/Event";
import { Events, Message } from "discord.js";

export default class MessageCreate extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.MessageCreate,
      description: "Message Create Event",
      once: false,
    });
  }

  async Execute(message: Message) {
    // something for the future
  }
}
