import { EmbedBuilder, User, type APIEmbedField, type ColorResolvable } from "discord.js";

interface EmbedArgs {
  name: string;
  value: string;
  inline?: boolean;
}

/**
 * Creates an embed with the specified parameters.
 *
 * @param color - The color of the embed.
 * @param title - The title of the embed.
 * @param description - The description of the embed.
 * @param author - The author of the embed.
 * @param args - Additional fields to be added to the embed.
 * @returns An instance of EmbedBuilder representing the embed.
 */
export default function createEmbed(
  color: ColorResolvable,
  title: string,
  description: string,
  author: User,
  ...args: APIEmbedField[]
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL() })
    .setTitle(title)
    .setDescription(description)
    .addFields(args)
    .setTimestamp();

  // console.log("Additional fields:", args);

  // args.forEach((arg: EmbedArgs) => {
  //   if (arg.name && arg.value) {
  //     embed.addFields({ name: arg.name, value: arg.value, inline: arg.inline ?? false });
  //   } else {
  //     console.warn("Invalid field:", arg);
  //   }
  // });

  return embed;
}