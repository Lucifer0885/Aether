import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import type CustomClient from '@base/classes/CustomClient';
import SubCommand from '@base/classes/SubCommand';

export default class TestOne extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: 'test.one',
    });
  }

  Execute(interaction: ChatInputCommandInteraction) {
    interaction.reply({
      content: 'Test one Command Executed!',
      ephemeral: true,
    });
  }
}
