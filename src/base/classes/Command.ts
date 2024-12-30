import type {
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from 'discord.js';
import type Category from '@enums/Category';
import type ICommand from '@base/interfaces/ICommand';
import type CustomClient from '@base/classes/CustomClient';
import type ICommandOptions from '@base/interfaces/ICommandOptions';

export default class Command implements ICommand {
  client: CustomClient;
  name: string;
  description: string;
  category: Category;
  options: object;
  default_member_permission: bigint;
  dm_permissions: boolean;
  cooldown: number;
  dev: boolean;

    constructor(client: CustomClient, options: ICommandOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.options = options.options;
        this.default_member_permission = options.default_member_permission;
        this.dm_permissions = options.dm_permissions;
        this.cooldown = options.cooldown;
        this.dev = options.dev;
    }

  Execute(interaction: ChatInputCommandInteraction): void {}

  Autocomplete(interaction: AutocompleteInteraction): void {}
}
