import { createBaseConfig } from "@wpazderski/eslint-config/base.config.js";
import type { ConfigArray } from "@wpazderski/eslint-config/types.js";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export default createBaseConfig({
    configs: [
        {
            rules: {
                // eslint core / "Suggestions"
                "max-lines-per-function": "off",

                // plugin: @typescript-eslint
                "@typescript-eslint/naming-convention": "off",
            },
        },
    ],
}) as ConfigArray;
