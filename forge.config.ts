import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { VitePlugin } from '@electron-forge/plugin-vite'
import type { ForgeConfig } from '@electron-forge/shared-types'
import { FuseV1Options, FuseVersion } from '@electron/fuses'
import 'dotenv/config'
import { writeFileSync } from 'fs'

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
  info: { [property: string]: any }
}

type AppUrl = {
  __type: 'offline' | 'local' | 'preview' | 'prod' | string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [property: string]: any
}

type AppMenu = {
  help_center: string
}

const typeCast = <T>(data: string): T => {
  try {
    const parsed_data = JSON.parse(data)
    return parsed_data as T
  } catch (error) {
    throw new Error(
      `Failed to parse config: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

const app = typeCast<App>(process.env.V_CONFIG_APP)
const author = typeCast<Author>(process.env.V_CONFIG_AUTHOR)

// END of v-config.ts

const getEnvBadge = () =>
  `${app.env === 'prod' ? '' : `.${app.env}.${app.status}`}`
const getAppBundleId = () =>
  `${app.pkg_bundle_id}${getEnvBadge()}.${app.app_bundle_id}`
const getBundleVersion = () =>
  `${app.build_version}${getEnvBadge()}.${process.env.SHA || Date.now()}`

// ******** CONFIG ********

const config: ForgeConfig = {
  outDir: './build',
  buildIdentifier: app.env,
  packagerConfig: {
    name: app.name,
    icon: 'images/icon',
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
  makers: [
    new MakerSquirrel({}, ['win32']),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}, ['linux']),
    new MakerDeb({}, ['linux'])
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main'
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload'
        }
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts'
        }
      ]
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
      [FuseV1Options.OnlyLoadAppFromAsar]: true
    })
  ],
  hooks: {
    generateAssets: async () => {
      const app_url = typeCast<AppUrl>(process.env.V_APP_URL)
      const url = app_url.__type !== 'offline' && app_url[app_url.__type]

      const app_menu = typeCast<AppMenu>(process.env.V_APP_MENU)

      writeFileSync(
        './src/v.config.json',
        JSON.stringify({
          V_IS_DEBUG: JSON.parse(process.env.V_IS_DEBUG) as boolean,
          V_APP_URL: url,
          V_HELP_CENTER: app_menu.help_center
        })
      )
    },
    readPackageJson: async (_, pkg) => {
      pkg.productName = ''
      pkg.executableName = pkg.name
      pkg.description = pkg.name
      pkg.productDescription = pkg.name
      return pkg
    }
  }
}

export default config
