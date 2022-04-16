import { generate } from "@graphql-codegen/cli";
import resolvePkg from "resolve-pkg";
import fs from "fs";
import path from "path";
import { getBGsdkDirectoryPath } from "./util/get-b-gsdk-directory-path";

export async function main() {
  console.log("starting main");
  const bgsdkDirectoryPath = getBGsdkDirectoryPath(process.cwd());

  console.log("got dir path:", bgsdkDirectoryPath);
  if (!bgsdkDirectoryPath) {
    throw new Error(
      "Make sure you have a b-gsdk directory in the root of your project."
    );
  }

  console.log("attempting codegen");
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
  console.log("ok COOl, i got it:", sdkCodegen);
  console.log("attempting to write to file");
  const resolved = resolvePkg("@b-gsdk/client");
  if (!resolved) {
    throw new Error("Please install @b-gsdk/client");
  }
  fs.writeFileSync(
    path.join(resolved, "generated/graphql.schema.json"),
    schemaCodegen.content
  );
  fs.writeFileSync(
    path.join(resolved, "generated/index.ts"),
    sdkCodegen.content
  );
  console.log("done");
}
