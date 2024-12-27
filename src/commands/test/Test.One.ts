import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import Command from '../../base/classes/Command';
import type CustomClient from '../../base/classes/CustomClient';
import Category from '../../base/enums/Category';
import SubCommand from '../../base/classes/SubCommand';

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
