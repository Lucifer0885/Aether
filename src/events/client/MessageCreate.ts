import type CustomClient from "@base/classes/CustomClient";
import Event from "@base/classes/Event";
import WarnLevel from "@base/enums/WarnLevel";
import Blacklist from "@base/schemas/Blacklist";
import GuildConfig from "@base/schemas/GuildConfig";
import { EmbedBuilder, Events, Message, PermissionFlagsBits, TextChannel } from "discord.js";

export default class MessageCreate extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.MessageCreate,
      description: "Message Create Event",
      once: false,
    });
  }

  async Execute(message: Message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const { Administrator, BanMembers, KickMembers, ManageMessages } = PermissionFlagsBits;

    const user = await message.guild.members.fetch(message.author.id);
    const blacklist = await Blacklist.findOne({ guildId: message.guildId });
    const guild = await GuildConfig.findOne({ guildId: message.guildId });
    const ignorePermissions = [Administrator, BanMembers, KickMembers, ManageMessages]

    if(ignorePermissions.map((p) => user.permissions.has(p))) return;

    if(user.id === message.guild.ownerId) return;

    if (
      guild &&
      guild.logs.moderation.enabled &&
      guild.logs.moderation.channelId
    ) {
      const channel = message.guild.channels.cache.get(
        guild.logs.moderation.channelId
      ) as TextChannel;

      blacklist?.words.map(async (w) => {
        if (message.content.toLowerCase().includes(w.word.toLowerCase())) {
          message.delete();
          switch (w.level) {
            case "Calm":
              try {
                await user.timeout(60000, `Blacklisted word: ${w.word}`);
                channel.send({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Red")
                      .setTitle("Blacklisted Word")
                      .setDescription(
                        `User: ${user} (${user.id})\nWord: ${w.word}\nLevel: ${w.level}\nChannel: ${message.channel}\nDuration: 1 minute`
                      )
                      .setTimestamp()
                      .setFooter({
                        text: `Actioned by ${this.client?.user?.tag} |  ${this.client?.user?.id}`,
                        iconURL: this.client?.user?.displayAvatarURL({
                          size: 64,
                        }),
                      }),
                  ],
                });
              } catch (error) {
                console.error(
                  `[ERROR] There was an error trying to timeout the user! `,
                  error
                );
              }

              break;

            case "Moderate":
              try {
                await user.timeout(3600000, `Blacklisted word: ${w.word}`);
                channel.send({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Red")
                      .setTitle("Blacklisted Word")
                      .setDescription(
                        `User: ${user} (${user.id})\nWord: ${w.word}\nLevel: ${w.level}\nChannel: ${message.channel}\nDuration: 1 hour`
                      )
                      .setTimestamp()
                      .setFooter({
                        text: `Actioned by ${this.client?.user?.tag} |  ${this.client?.user?.id}`,
                        iconURL: this.client?.user?.displayAvatarURL({
                          size: 64,
                        }),
                      }),
                  ],
                });
              } catch (error) {
                console.error(
                  `[ERROR] There was an error trying to timeout the user! `,
                  error
                );
              }
              break;

            case "Severe":
              try {
                await user.timeout(86400000, `Blacklisted word: ${w.word}`);
                channel.send({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Red")
                      .setTitle("Blacklisted Word")
                      .setDescription(
                        `User: ${user} (${user.id})\nWord: ${w.word}\nLevel: ${w.level}\nChannel: ${message.channel}\nDuration: 24 hours`
                      )
                      .setTimestamp()
                      .setFooter({
                        text: `Actioned by ${this.client?.user?.tag} |  ${this.client?.user?.id}`,
                        iconURL: this.client?.user?.displayAvatarURL({
                          size: 64,
                        }),
                      }),
                  ],
                });
              } catch (error) {
                console.error(
                  `[ERROR] There was an error trying to timeout the user! `,
                  error
                );
              }
              break;
          }

          (message.channel as TextChannel)
            .send(`You cannot say that word!`)
            .then((msg: Message) => {
              setTimeout(() => {
                msg.delete();
              }, 5000);
            });
        }
      });
    }
  }
}
