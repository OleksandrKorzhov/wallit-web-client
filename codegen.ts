import { CodegenConfig } from '@graphql-codegen/cli';
import appConfig from "./src/config";

const codegen: CodegenConfig = {
  schema: appConfig.server.graphQLUrl,
  documents: ['src/**/*.tsx', "src/**/*.ts"],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
  ignoreNoDocuments: true,
};

export default codegen;
