import type WarnLevel from "@base/enums/WarnLevel";
import { Schema, model } from "mongoose";

interface IBlacklist {
  guildId: string;
  words: {
    word: string;
    level: WarnLevel;
  }[];
}

export default model<IBlacklist>(
  "Blacklist",
  new Schema<IBlacklist>(
    {
      guildId: { type: String, required: true, unique: true },
      words: [
        {
          word: { type: String, required: true },
          level: { type: String, required: true },
        }
      ]
    },
    {
      timestamps: true,
      versionKey: false,
      strict: true,
    }
  )
);
