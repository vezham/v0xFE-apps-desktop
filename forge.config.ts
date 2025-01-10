import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const name = 'Vezham Messages'
const appCategoryType = 'public.app-category.business' // wjdlz/NOTE: [Apple's documentation](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8)
const appVersion = '1.0.5'
const buildVersion = 'v0x250113'

const appBundleId = {
  'prod': 'com.vezham.apps.messages',
  'beta': 'com.vezham.beta.apps.messages',
}

const appCopyright = 'Copyright © 2025 Vezham. All rights reserved.'
const extendInfo = {
  "v0xauthor":"v0xfe-desktop-apps"
}

// END of v-config.ts

const getBuildIdentifier = () => {
  return process.env.IS_BETA ? 'beta' : 'prod'
}

const getAppBundleId = () => {
  const id = appBundleId || {
    'prod': 'com.vezham.apps',
    'beta': 'com.vezham.beta.apps',
  }
  return id[getBuildIdentifier()]
}

// ******** CONFIG ********

const config: ForgeConfig = {
  outDir: './build',
  buildIdentifier: getBuildIdentifier,
  packagerConfig: {
    name,
    icon:'images/icon',
    appBundleId: getAppBundleId(),
    appVersion,
    buildVersion,
    appCategoryType,
    appCopyright,
    extendInfo,
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
  ],
};

export default config;
