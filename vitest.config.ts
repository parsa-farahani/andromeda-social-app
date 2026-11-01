
import { defineConfig } from "vitest/config";

export default defineConfig(
   {
      resolve: { tsconfigPaths: true },
      test: {
         environment: "node",
         env: {
            ACCESS_TOKEN_SECRET_KEY: "test-access-secret",
            REFRESH_TOKEN_SECRET_KEY: "test-refresh-secret",
         },
      },
   }
);