import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import dsv from '@rollup/plugin-dsv';
import importAssets from 'svelte-preprocess-import-assets';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [importAssets(), preprocess()],

  kit: {
    paths: {
      base: dev ? '' : '/phd_with_svelte',   // 👈 important
    },
    adapter: adapter({
      pages: 'docs',
      assets: 'docs',
      fallback: null,
      precompress: false
    }),
    vite: {
      plugins: [dsv()]
    }
  }
};

export default config;

