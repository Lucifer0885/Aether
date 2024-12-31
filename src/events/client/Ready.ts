import { ActivityType, Collection, Events, PresenceUpdateStatus, REST, Routes } from "discord.js";
import type CustomClient from "@base/classes/CustomClient";
import Event from "@base/classes/Event";
import type Command from "@base/classes/Command";
import {
  TOKEN,
  CLIENT_ID,
  DEV_SERVER,
  DEV_CLIENT_ID,
  DEV_TOKEN,
} from "@data/constants";


export default class Ready extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.ClientReady,
      description: "This event is triggered when the client is ready.",
      once: true,
    });
  }
  async Execute() {
    console.log(`Logged in as ${this.client.user?.tag}!`);

    this.client.user?.setPresence({
      activities: [
        {
          name: "Visual Studio Code",
          type: ActivityType.Playing,
          state: "with TypeScript",
        },
      ],
      status: PresenceUpdateStatus.Online,
    });

    // this.client.user?.setBanner("https://i.imgur.com/us5AEYY.jpeg");

    const clientId = this.client.developmentMode ? DEV_CLIENT_ID : CLIENT_ID;
    const rest = new REST().setToken(this.client.developmentMode ? DEV_TOKEN : TOKEN);

    if (!this.client.developmentMode) {
      const globalCommands: any = await rest.put(
        Routes.applicationCommands(clientId),
        {
          body: this.GetJson(
            this.client.commands.filter((command) => !command.dev)
          ),
        }
      );

      console.log(
        `Successfully registered ${globalCommands.length} global application command(s)`
      );
    }

    const devCommands: any = await rest.put(
      Routes.applicationGuildCommands(clientId, DEV_SERVER),
      {
        body: this.GetJson(
          this.client.commands.filter((command) => command.dev)
        ),
      }
    );

    console.log(
      `Successfully registered ${devCommands.length} dev application command(s)`
    );
  }

  private GetJson(commands: Collection<string, Command>): object[] {
    const data: object[] = [];

    commands.forEach((command: Command) => {
      data.push({
        name: command.name,
        description: command.description,
        options: command.options,
        default_member_permission: command.default_member_permission.toString(),
        dm_permissions: command.dm_permissions,
      });
    });

    return data;
  }
}
