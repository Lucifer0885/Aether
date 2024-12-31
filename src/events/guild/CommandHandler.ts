import {
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  Events,
} from "discord.js";
import type CustomClient from "@base/classes/CustomClient";
import Event from "@base/classes/Event";
import type Command from "@base/classes/Command";
import { DEV_IDS } from "@data/constants";

export default class CommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Command Handler",
      once: false,
    });
  }
  Execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.isCommand()) return;

    const command: Command = this.client.commands.get(interaction.commandName)!;

    //@ts-ignore
    if (!command) return (interaction.reply({content: "This command does not exist!",ephemeral: true,}) && this.client.commands.delete(interaction.commandName));

    if (command.dev && !DEV_IDS.includes(interaction.user.id))
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("This command is only available for developers!"),
        ],
        ephemeral: true,
      });

    if (!interaction.memberPermissions?.has(command.default_member_permission)){
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "❌ You do not have permission to use this command!"
            ),
        ],
        ephemeral: true,
      });
    }

    const { cooldowns } = this.client;

    if (!cooldowns.has(command.name))
      cooldowns.set(command.name, new Collection());

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (
      timestamps?.has(interaction.user.id) &&
      now < (timestamps.get(interaction.user.id)! || 0) + cooldownAmount
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `Please wait ${(
                ((timestamps.get(interaction.user.id)! || 0) +
                  cooldownAmount -
                  now) /
                1000
              ).toFixed(1)} more second(s) before reusing the \`${
                command.name
              }\` command.`
            ),
        ],
        ephemeral: true,
      });
    }

    timestamps?.set(interaction.user.id, now);
    setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount);

    try {
      const subCommandGroup = interaction.options.getSubcommandGroup(false);
      const subCommand = `${interaction.commandName}${
        subCommandGroup ? `-${subCommandGroup}` : ""
      }.${interaction.options.getSubcommand(false)}`;

      return (
        this.client.subCommands.get(subCommand)?.Execute(interaction) ||
        command.Execute(interaction)
      );
    } catch (error) {
      console.error(error);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("There was an error while executing this command!"),
        ],
        ephemeral: true,
      });
    }
  }
}
