import os from "os";
// eslint-disable-next-line import/no-extraneous-dependencies
import { type PlaywrightTestConfig, type ViewportSize, devices } from "@playwright/test";
import type { RequiredNonNullable } from "./types.ts";

export interface BasePlaywrightConfigOptions {
    isCi: boolean;
    testDir?: string | undefined;
    fullyParallel?: boolean | undefined;
    retries?:
        | {
              ci: number;
              nonCi: number;
          }
        | undefined;
    workers?:
        | {
              ci: number;
              nonCi: number;
          }
        | undefined;
    testIdAttribute?: string | undefined;
    webServerUrl?: string | undefined;
    webServerCommand?: string | undefined;
    viewport?: ViewportSize | undefined;
}

export const defaultBasePlaywrightConfigOptions: RequiredNonNullable<Omit<BasePlaywrightConfigOptions, "isCi">> = {
    testDir: "./",
    fullyParallel: true,
    retries: {
        ci: 2,
        nonCi: 0,
    },
    workers: {
        ci: 1,
        nonCi: os.cpus().length,
    },
    testIdAttribute: "data-test-id",
    webServerUrl: "http://localhost:3000",
    webServerCommand: "pnpm run start-test-server",
    viewport: {
        width: 1920,
        height: 1080,
    },
};

export function getBasePlaywrightConfig(partialOptions: BasePlaywrightConfigOptions): PlaywrightTestConfig {
    const webServerUrlObj = new URL(partialOptions.webServerUrl ?? defaultBasePlaywrightConfigOptions.webServerUrl);
    const webServerUrlOrigin = webServerUrlObj.origin;
    let webServerUrlWithPath = webServerUrlObj.href;
    if (!webServerUrlWithPath.endsWith("/")) {
        webServerUrlWithPath += "/";
    }

    const options: RequiredNonNullable<BasePlaywrightConfigOptions> = {
        isCi: partialOptions.isCi,
        testDir: partialOptions.testDir ?? defaultBasePlaywrightConfigOptions.testDir,
        fullyParallel: partialOptions.fullyParallel ?? defaultBasePlaywrightConfigOptions.fullyParallel,
        retries: partialOptions.retries ?? defaultBasePlaywrightConfigOptions.retries,
        workers: partialOptions.workers ?? defaultBasePlaywrightConfigOptions.workers,
        testIdAttribute: partialOptions.testIdAttribute ?? defaultBasePlaywrightConfigOptions.testIdAttribute,
        webServerUrl: partialOptions.webServerUrl ?? defaultBasePlaywrightConfigOptions.webServerUrl,
        webServerCommand: partialOptions.webServerCommand ?? defaultBasePlaywrightConfigOptions.webServerCommand,
        viewport: partialOptions.viewport ?? defaultBasePlaywrightConfigOptions.viewport,
    };

    return {
        testDir: options.testDir,
        fullyParallel: options.fullyParallel,
        forbidOnly: options.isCi,
        retries: options.isCi ? options.retries.ci : options.retries.nonCi,
        workers: options.isCi ? options.workers.ci : options.workers.nonCi,
        reporter: [
            [
                "html",
                {
                    open: "never",
                },
            ],
        ],
        use: {
            baseURL: webServerUrlWithPath,
            trace: "on-first-retry",
            testIdAttribute: options.testIdAttribute,
            viewport: options.viewport,
        },
        projects: [
            {
                name: "chromium",
                use: {
                    ...devices["Desktop Chrome"],
                    viewport: options.viewport,
                },
            },
            {
                name: "firefox",
                use: {
                    ...devices["Desktop Firefox"],
                    viewport: options.viewport,
                },
            },
            {
                name: "webkit",
                use: {
                    ...devices["Desktop Safari"],
                    viewport: options.viewport,
                },
            },
        ],
        webServer: {
            command: options.webServerCommand,
            url: webServerUrlOrigin,
            reuseExistingServer: !options.isCi,
        },
    };
}
