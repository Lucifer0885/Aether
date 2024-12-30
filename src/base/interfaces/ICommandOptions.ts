import type Category from "@base/enums/Category";

export default interface ICommand {
    name: string;
    description: string;
    category: Category;
    options: object;
    default_member_permission: bigint;
    dm_permissions: boolean;
    cooldown: number;
    dev: boolean;
}