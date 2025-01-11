import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import 'dotenv/config'

// console.log('forge.config/[V_CONFIG_APP]', process.env.V_CONFIG_APP)
// console.log('forge.config/[V_CONFIG_AUTHOR]', process.env.V_CONFIG_AUTHOR)

type App = {
  name: string
  category: string // wjdlz/NOTE: [Apple's documentation](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8)
  app_version: string
  build_version: string
  // ConfigBuild
  pkg_bundle_id: string
  app_bundle_id: string
  env: 'local' | 'tva' | 'dev' | 'qa' | 'preview' | 'prod'
  status: 'unstable' | 'alpha' | 'beta' | 'stable' // wjdlz/NOTE: stable -->'prod'
}

type Author = {
  copyright: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: {[property: string]: any}
}

const typeCast = <T>(data: string): T => {
  try {
    const parsed_data = JSON.parse(data);
    return parsed_data as T;
  } catch (error) {
    throw new Error(`Failed to parse config: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

const app = typeCast<App>(process.env.V_CONFIG_APP)
const author = typeCast<Author>(process.env.V_CONFIG_AUTHOR)

// END of v-config.ts

const getAppBundleId = () => `${app.pkg_bundle_id}${app.env === 'prod'? '' : `.${app.env}.${app.status}`}.${app.app_bundle_id}`
const getBundleVersion = () => `${app.build_version}.${process.env.SHA || Date.now()}`

// ******** CONFIG ********

const config: ForgeConfig = {
  outDir: './build',
  buildIdentifier: app.env,
  packagerConfig: {
    name: app.name,
    icon:'images/icon',
    appBundleId: getAppBundleId(),
    appVersion: app.app_version,
    buildVersion: getBundleVersion(),
    appCategoryType: app.category,
    appCopyright: author.copyright,
    extendInfo: author.info,
    asar: true
    // osxSign: {},
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({}, ['win32']), new MakerZIP({}, ['darwin']), new MakerRpm({}, ['linux']), new MakerDeb({}, ['linux'])],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ]
};

export default config;
