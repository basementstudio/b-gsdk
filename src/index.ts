import { generate } from "@graphql-codegen/cli";
import fs from "fs";
import path from "path";
import { Args } from "./bin";
import { getBGsdkConfig } from "./util/get-b-gsdk-config";
import { getBGsdkDirectoryPath } from "./util/get-b-gsdk-directory-path";

export async function main(args: Args) {
  const bgsdkDirectoryPath = getBGsdkDirectoryPath(
    process.cwd(),
    args["--dir"]
  );

  if (!bgsdkDirectoryPath) {
    throw new Error(
      "Make sure you have a b-gsdk directory in the root of your project."
    );
  }

  const config = getBGsdkConfig(bgsdkDirectoryPath);

  const [schemaCodegen, sdkCodegen] = await generate(
    {
      schema: {
        [config.endpoint]: {
          headers: config.headers,
        },
      },
      generates: {
        [__dirname + "/generated/index.ts"]: {
          documents: [
            bgsdkDirectoryPath + "/**/*.{gql,graphql}",
            bgsdkDirectoryPath + "/*.{gql,graphql}",
          ],
          plugins: [
            "typescript",
            "typescript-operations",
            "typescript-graphql-request",
          ],
        },
        [__dirname + "/generated/graphql.schema.json"]: {
          plugins: ["introspection"],
          config: {
            documentMode: "documentNode",
            withHooks: true,
          },
        },
      },
    },
    false
  );

  createDirIfDoesNotExist(`${bgsdkDirectoryPath}/generated`);
  fs.writeFileSync(
    path.join(bgsdkDirectoryPath, "generated/graphql.schema.json"),
    schemaCodegen.content
  );
  fs.writeFileSync(
    path.join(bgsdkDirectoryPath, "generated/index.ts"),
    "/* eslint-disable */\n" + sdkCodegen.content + "\n" + extraGenerated
  );
  const skdFilePath = path.join(bgsdkDirectoryPath, "sdk.ts");
  if (!fs.existsSync(skdFilePath)) {
    fs.writeFileSync(skdFilePath, sdkFileContents);
  }

  console.log("Done ✨");
}

function createDirIfDoesNotExist(p: string) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

const extraGenerated = `export type CreateBgSdkParams = {
  endpoint: string
  headers?: string[][] | Record<string, string> | Headers
}

export const createBgSdk = ({
  endpoint,
  headers
}: CreateBgSdkParams) => {
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }
  })

  const generatedSdk = getSdk(graphQLClient)

  return { ...generatedSdk, client: graphQLClient }
}
`;

const sdkFileContents = `import config from './config'
import { createBgSdk } from './generated'

export const bgSdk = createBgSdk(config)

`;
