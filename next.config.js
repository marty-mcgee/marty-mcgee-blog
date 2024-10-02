const config = require("./src/config/config.json")
const languages = require("./src/config/language.json")
const disableLanguages = config.settings.disable_languages
const activeLanguages = languages.filter(
  (lang) => !disableLanguages.includes(lang.languageCode),
)

const defaultLanguage = config.settings.default_language

const otherLanguages = activeLanguages
  .map((lang) => lang.languageCode)
  .filter((lang) => lang !== defaultLanguage)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: config.base_path !== "/" ? config.base_path : "",
  trailingSlash: config.site.trailing_slash,
  // output: "standalone",

  async rewrites() {
    if (config.settings.default_language_in_subdir) {
      return []
    }

    return activeLanguages.length !== 1
      ? [
          {
            source: `/:lang(!${defaultLanguage}|${otherLanguages.join("|")})/:path*`,
            destination: `/:lang/:path*`,
          },
          {
            source: `/:path*`,
            destination: `/${defaultLanguage}/:path*`,
          },
        ]
      : [
          {
            source: `/${defaultLanguage}/:path*`,
            destination: `/${defaultLanguage}/:path*`,
          },
          {
            source: "/:path*",
            destination: `/${defaultLanguage}/:path*`,
          },
        ]
  },

  // ** CUSTOM NEXT CONFIG [MM]
  // ** IMAGES (production use?)
  images: {

    // deprecated: use remotePatterns..
    // domains: [
    //   // process.env.NEXT_PUBLIC_WP_GRAPHQL_API_URL.match(/(?!(w+)\.)\w*(?:\w+\.)+\w+/)[0],
    //   // Valid WP Image domain.
    //   // '0.gravatar.com',
    //   // '1.gravatar.com',
    //   // '2.gravatar.com',
    //   // 'secure.gravatar.com',
    //   // 'images.cdndomain.com',
    // ],
    remotePatterns: [
      // {
      //   protocol: 'http',
      //   hostname: '**',
      //   // port: '7777',
      //   // pathname: '/**',
      // },
      {
        protocol: 'https',
        hostname: 'threedpublic.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      },
    ],
    // // loader: 'default',
    // // // path: 'https://somedomain.com/mydirectory/',
    // // // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // // // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // formats: ['image/avif', 'image/webp'],
    // // // minimumCacheTTL: 60,
    // disableStaticImages: true, // for avif image files to work properly
    // // dangerouslyAllowSVG: true,
    // // contentSecurityPolicy: 'default-src 'self'; script-src 'none'; sandbox;',
  },

  // ** WEBPACK [MM]
  webpack(config, { isServer }) {
    // glb + gltf support
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      // include: [/public/],
      exclude: /node_modules/,
      type: 'asset/resource',
    })
    return config
  },

}

module.exports = nextConfig
