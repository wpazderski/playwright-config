import os from "os";
// eslint-disable-next-line import/no-extraneous-dependencies
import { type PlaywrightTestConfig, type ViewportSize, devices } from "@playwright/test";
import type { RequiredNonNullable } from "./types.ts";

/**
 * Ooptions for the base Playwright configuration.
 */
export interface BasePlaywrightConfigOptions {
    /**
     * Whether the tests are running in a CI environment.
     * This will affect the number of retries and workers (see options {@link BasePlaywrightConfigOptions.retries} and {@link BasePlaywrightConfigOptions.workers}).
     * If set to true, `test.only` calls will cause the test run to fail.
     * If a WebServer is already running, it will be reused if `isCi` is false.
     */
    isCi: boolean;

    /**
     * The directory where the tests are located.
     * Defaults to `./`.
     * See {@link PlaywrightTestConfig.testDir}.
     */
    testDir?: string | undefined;

    /**
     * Whether to run tests in parallel.
     * Defaults to `true`.
     * See {@link PlaywrightTestConfig.fullyParallel}.
     */
    fullyParallel?: boolean | undefined;

    /**
     * The number of retries for failed tests based on the environment (CI or non-CI).
     * Defaults to `{ ci: 2, nonCi: 0 }`.
     * See {@link PlaywrightTestConfig.retries}.
     */
    retries?:
        | {
              ci: number;
              nonCi: number;
          }
        | undefined;

    /**
     * The number of workers to use based on the environment (CI or non-CI).
     * Defaults to `{ ci: 1, nonCi: os.cpus().length }`.
     * See {@link PlaywrightTestConfig.workers}.
     */
    workers?:
        | {
              ci: number;
              nonCi: number;
          }
        | undefined;

    /**
     * The attribute used to identify test elements in the DOM.
     * Defaults to `data-test-id`.
     * See {@link PlaywrightTestConfig.use.testIdAttribute}.
     */
    testIdAttribute?: string | undefined;

    /**
     * The base URL for the tests.
     * * Origin of the URL will be used as {@link PlaywrightTestConfig.webServer.url}.
     * * The full URL (with path and trailing slash) will be used as {@link PlaywrightTestConfig.use.baseURL}.
     * Defaults to `http://localhost:3000`.
     */
    webServerUrl?: string | undefined;

    /**
     * The command to start the web server for testing.
     * Defaults to `pnpm run start-test-server`.
     * See {@link PlaywrightTestConfig.webServer.command}.
     */
    webServerCommand?: string | undefined;

    /**
     * The viewport size for the tests.
     * Defaults to `{ width: 1920, height: 1080 }`.
     * See {@link PlaywrightTestConfig.use.viewport}.
     */
    viewport?: ViewportSize | undefined;
}

/**
 * Default options for the base Playwright configuration.
 * These options can be overridden by the user when creating a custom configuration.
 */
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

/**
 * Generates a base Playwright configuration based on the provided options.
 *
 * @param partialOptions - Partial options to customize the base configuration.
 * @returns A {@link PlaywrightTestConfig} object created using the provided options.
 */
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
            ["list"],
            [
                "html",
                {
                    open: "never",
                },
            ],
        ],
        use: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
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
