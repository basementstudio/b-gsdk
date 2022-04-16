import { generate } from "@graphql-codegen/cli";
import fs from "fs";
import path from "path";
import { getBGsdkDirectoryPath } from "./util/get-b-gsdk-directory-path";

export async function main() {
  const bgsdkDirectoryPath = getBGsdkDirectoryPath(process.cwd());

  if (!bgsdkDirectoryPath) {
    throw new Error(
      "Make sure you have a b-gsdk directory in the root of your project."
    );
  }

  const [schemaCodegen, sdkCodegen] = await generate(
    {
      schema: {
        "https://mr-beast-2.myshopify.com/api/2021-10/graphql": {
          headers: {
            "x-shopify-storefront-access-token":
              "374a3639228aeb7798d99d88002c4b2e",
          },
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
    sdkCodegen.content
  );
  fs.writeFileSync(path.join(bgsdkDirectoryPath, "sdk.ts"), sdkFileContents);
  console.log("Done ✨");
}

function createDirIfDoesNotExist(p: string) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

const sdkFileContents = `import { GraphQLClient } from 'graphql-request'
import { getSdk } from './generated'

export type CreateBGsdkClientParams = {
  endpoint: string
  headers?: string[][] | Record<string, string> | Headers
}

export const createBGsdk = ({ endpoint, headers }: CreateBGsdkClientParams) => {
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }
  })

  const generatedSdk = getSdk(graphQLClient)

  return { ...generatedSdk, rawClient: graphQLClient }
}
`;
