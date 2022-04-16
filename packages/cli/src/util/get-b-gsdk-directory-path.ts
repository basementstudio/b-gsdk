import fs from "fs";
import path from "path";

// taken from prisma https://github.com/prisma/prisma/blob/8f6b7c7c99c1c720cf5bfed5d563423e71c1b84f/packages/sdk/src/cli/getSchema.ts#L46-L49
export const getBGsdkDirectoryPath = (cwd: string) => {
  const schemaPath = path.join(cwd, "b-gsdk");
  if (fs.existsSync(schemaPath)) {
    return schemaPath;
  }

  return null;
};
