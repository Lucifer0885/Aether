import { ChatInputCommandInteraction } from 'discord.js';
import type CustomClient from '../../base/classes/CustomClient';
import SubCommand from '../../base/classes/SubCommand';

export default class TestTwo extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: 'test.two',
    });
  }

  Execute(interaction: ChatInputCommandInteraction) {
    interaction.reply({
      content: 'Test two Command Executed!',
      ephemeral: true,
    });
  }
}