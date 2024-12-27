import { Schema,model } from "mongoose";

interface IGuildConfig {
    guildId: string;
    guildName: string;
}

export default model<IGuildConfig>("GuildConfig", new Schema<IGuildConfig>({
    guildId: { type: String, required: true, unique: true },
    guildName: { type: String, required: true }
}, {
    timestamps: true,
    versionKey: false,
    strict: true,
}));;