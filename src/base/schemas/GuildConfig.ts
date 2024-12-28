import { Schema,model } from "mongoose";

interface IGuildConfig {
    guildId: string;
    guildName: string;
    logs: {
        moderation: {
            enabled: boolean;
            channelId: string;
        };
    }
}

export default model<IGuildConfig>("GuildConfig", new Schema<IGuildConfig>({
    guildId: { type: String, required: true, unique: true },
    guildName: { type: String, required: true },
    logs: {
        moderation: {
            enabled: { type: Boolean },
            channelId: { type: String },
        },
    },
}, {
    timestamps: true,
    versionKey: false,
    strict: true,
}));;