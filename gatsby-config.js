"use strict";

const path = require("path");
const siteMetadata = require("./src/metadata.json");

module.exports = {
  siteMetadata,
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-styled-components`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // reference: https://www.gatsbyjs.org/packages/gatsby-plugin-react-helmet
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-fontawesome-css",
    "gatsby-plugin-postcss",
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: false,
        develop: false,
        tailwind: true,
      },
    },
    // reference: https://www.gatsbyjs.com/plugins/gatsby-background-image/
    // add support for background images + Tailwind
    {
      resolve: "gatsby-background-image",
      options: {
        // add your own characters to escape, replacing the default ':/'
        specialChars: "/:",
      },
    },
    // make images available through GraphQL queries
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `assets/images`),
      },
    },
    // blog
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: path.join(__dirname, `content`, `blog`),
      },
    },
    //references:
    // https://www.gatsbyjs.org/packages/gatsby-plugin-react-svg/
    // https://github.com/jacobmischka/gatsby-plugin-react-svg
    // https://github.com/jhamlet/svg-react-loader
    {
      resolve: "gatsby-plugin-react-svg",
      test: /\.svg$/,
      options: {
        rule: {
          include: /assets\/images\/svg\//,
        },
      },
    },
    {
      resolve: "gatsby-plugin-stylelint",
      options: {
        configFile: ".stylelintrc",
        emitErrors: false,
        files: ["src/**/*.?(pc|sc|c|sa)ss"], // pcss|scss|css|sass
      },
    },
    // reference: https://www.npmjs.com/package/gatsby-plugin-sitemap
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        // Exclude specific pages or groups of pages using glob parameters
        // See: https://github.com/isaacs/minimatch
        // The example below will exclude the single `path/to/page` and all routes beginning with `category`
        exclude: ["/elements"],
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }

          allSitePage {
            edges {
              node {
                path
              }
            }
          }
      }`,
      },
    },
    // reference: https://www.gatsbyjs.org/packages/gatsby-plugin-manifest
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: siteMetadata.title,
        short_name: siteMetadata.title,
        description: siteMetadata.description,
        start_url: `/`,
        background_color: "#263545", // devConceptsBlue-700
        theme_color: "#4A6887", // devConceptsBlue-500
        display: `minimal-ui`,
        icon: "src/assets/images/svg/developassion-symbol.svg", // This path is relative to the root of the site.
        //theme_color_in_head: false, // This will avoid adding theme-color meta tag.
        // TODO add other icons
        // icons: [
        //   {
        //     src: "icons/icon_512x512.png",
        //     sizes: "512x512",
        //     types: "image/png",
        //   },
        //   {
        //     src: "icons/icon_192x192.png",
        //     sizes: "192x192",
        //     types: "image/png",
        //   },
        // ],
      },
    },
    // reference: https://www.gatsbyjs.org/packages/gatsby-plugin-netlify/
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          "/*": [
            // The CSP is generated by gatsby-plugin-csp and added to the _headers file in public/ before publish.
            // That is handled by the build:prod script which executes csp-util.js, which looks for the token below.
            "Content-Security-Policy: __REPLACE_ME__",
            //"Access-Control-Allow-Origin: null",
            //"Clear-Site-Data: *" // useful for logout pages: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Clear-Site-Data

            // reference: https://scotthelme.co.uk/goodbye-feature-policy-and-hello-permissions-policy/
            "Permissions-Policy: accelerometer=(), camera=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(self), usb=()",
            "Referrer-Policy: strict-origin",
            "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload",
            "Upgrade-Insecure-Requests: 1",
            "X-Content-Type-Options: nosniff",
            "X-DNS-Prefetch-Control: on",
            "X-Download-Options: noopen",
            "X-Frame-Options: DENY",
            "X-Permitted-Cross-Domain-Policies: none",
            "X-XSS-Protection: 0",
          ],
        }, // option to add more headers. `Link` headers are transformed by the below criteria
        allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
        mergeSecurityHeaders: true, // boolean to turn off the default security headers
        mergeLinkHeaders: true, // boolean to turn off the default gatsby js headers
        mergeCachingHeaders: true, // boolean to turn off the default caching headers
        generateMatchPathRewrites: true, // boolean to turn off automatic creation of redirect rules for client only paths
      },
    },
    // Reference: https://www.gatsbyjs.com/plugins/gatsby-plugin-csp/
    {
      resolve: `gatsby-plugin-csp`,
      options: {
        disableOnDev: false,
        mergeScriptHashes: true,
        mergeStyleHashes: false,
        mergeDefaultDirectives: false,
        // references:
        // https://content-security-policy.com/
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
        // https://scotthelme.co.uk/csp-cheat-sheet
        directives: {
          "base-uri": "'self'",
          "block-all-mixed-content": "",
          "child-src": "'self'",
          "connect-src": "'self' http://localhost:8000 http://localhost:* ws://localhost:* app.convertkit.com fonts.googleapis.com www.google-analytics.com",
          "default-src": "'self'",
          "disown-opener": "",
          "font-src": "'self' data: https://fonts.gstatic.com",
          "form-action": "'none'",
          //"frame-ancestors": "'none'", // cannot be used if CSP defined using a meta tag
          "frame-src": "'self'",
          "img-src": "'self' data: www.google-analytics.com fonts.gstatic.com",
          "manifest-src": "'self'",
          "media-src": "'self'",
          "object-src": "'self'",
          "plugin-types": "application/pdf",
          "prefetch-src": "'self'",
          sandbox: "",
          "script-src": "'self' www.google-analytics.com www.googletagmanager.com 'sha256-KWO6UOhc/cfhZd4gtXYPu4WkSRPuCQDtCkF/v9OyJB8=' 'sha256-QAj9SgqS0tkqFXsMg6gbHzN3KfNnrPW0N0FCdMzN3MI=' 'nonce-fcd8146f-6701-4dca-9165-3ed4c96a3b5a'",
          "style-src": "'self' 'unsafe-inline' blob: https://fonts.googleapis.com",
          "upgrade-insecure-requests": "",
          "worker-src": "'self'",
        },
      },
    },

    // references:
    // https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag
    // https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-google-gtag
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-TL0EMPNJ06", // Google Analytics / GA
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
          //optimize_id: "OPT_CONTAINER_ID",
          anonymize_ip: true,
          cookie_expires: 0,
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: true,
          // Respect user privacy
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          exclude: [],
        },
      },
    },

    // reference: https://github.com/dequelabs/axe-core/blob/master/doc/API.md#api-name-axeconfigure
    {
      resolve: "gatsby-plugin-react-axe",
      options: {
        showInProduction: false,
        axeOptions: {
          // Your axe-core options.
        },
      },
    },
    // Offline plugin
    // Reference: https://www.gatsbyjs.com/plugins/gatsby-plugin-offline/
    // WARNING: Should be last so that it can include/cache other metadata/manifests
    // FIXME re-enable offline
    //`gatsby-plugin-offline`,
  ],
};
