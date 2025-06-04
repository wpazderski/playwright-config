# playwright-config

Common [Playwright](https://playwright.dev/) configs

## Installation and usage

Start by installing this package, for example with `pnpm`:

```sh
pnpm i -D @wpazderski/playwright-config
```

Then create `playwright.config.ts` file, for example:

```ts
import type { PlaywrightTestConfig } from "@playwright/test";
import { get<CONFIG_NAME>PlaywrightConfig } from "@wpazderski/playwright-config/<CONFIG_NAME>.config.js";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export default get<CONFIG_NAME>PlaywrightConfig({
    isCi: isCi,
    webServerUrl: "http://localhost:3000",
    testDir: "./tests",
}) as PlaywrightTestConfig;
```

Replace `<CONFIG_NAME>` with chosen config (see [Available configs](#available-configs) section), for example:

```ts
import type { PlaywrightTestConfig } from "@playwright/test";
import { getBasePlaywrightConfig } from "@wpazderski/playwright-config/base.config.js";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export default getBasePlaywrightConfig({
    isCi: isCi,
    webServerUrl: "http://localhost:3000",
    testDir: "./tests",
}) as PlaywrightTestConfig;
```

## Available configs

Currently only one config is provided - `base`.

## Related projects

- [@wpazderski/eslint-config](https://github.com/wpazderski/eslint-config),
- [@wpazderski/typescript-config](https://github.com/wpazderski/typescript-config),
- [@wpazderski/playwright-utils](https://github.com/wpazderski/playwright-utils),
- [@wpazderski/configs-utils-example](https://github.com/wpazderski/configs-utils-example) - an example project that shows how to use all configs and utils.
