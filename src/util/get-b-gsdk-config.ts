import fs from "fs";
import path from "path";
import { z } from "zod";

const configSchema = z.object({
  schemaURL: z.string(),
  headers: z.record(z.string()),
});

export const getBGsdkConfig = (directoryPath: string) => {
  const bgsdkConfigPath = path.join(directoryPath, "config.json");
  if (!fs.existsSync(bgsdkConfigPath)) {
    throw new Error(
      `Could not find config.json in ${directoryPath}! Please create one.`
    );
  }
  const rawConfig = JSON.parse(fs.readFileSync(bgsdkConfigPath, "utf8"));
  const parsedConfig = configSchema.parse(rawConfig);
  return parsedConfig;
};
