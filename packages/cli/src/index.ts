import { generate } from "@graphql-codegen/cli";
import resolvePkg from "resolve-pkg";
import fs from "fs";
import path from "path";

async function main() {
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
            __dirname + "/docs/**/*.{gql,graphql}",
            __dirname + "/docs/*.{gql,graphql}",
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
  const resolved = resolvePkg("@b-gen/client");
  if (!resolved) {
    console.error("Please install @b-gen/client");
    return;
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

main();
