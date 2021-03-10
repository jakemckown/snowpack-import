/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: {
      url: '/',
      static: true
    },
    src: {
      url: '/dist'
    },
  },
  plugins: [
    ['@snowpack/plugin-svelte', {
      hmrOptions: {
        noPreserveState: true
      }
    }],
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-postcss',
    ['snowpack-plugin-terser', {
      terserOptions: {
        compress: {
          arguments: true,
          passes: 2
        }
      }
    }]
  ],
  devOptions: {
    port: 5000
  },
  buildOptions: {
    clean: true
  },
  optimize: {
    bundle: true,
    minify: true
  }
};
