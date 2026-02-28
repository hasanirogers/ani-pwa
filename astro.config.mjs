/** @type {import('@vite-pwa/astro').PWAOptions} */
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro'
import * as dotenv from 'dotenv';
import vercel from '@astrojs/vercel';

// enable only when simulating https locally
// import mkcert from 'vite-plugin-mkcert';

dotenv.config();

let site;
let port;

switch (process.env.PUBLIC_ANI_ENV) {
  case 'production':
    port = 4321;
    site = "https://anibookquotes.com";
    break;
  default:
    port = 4321;
    site = `http://localhost:${port}`;
}


const pwaConfig = {
  mode: process.env.PUBLIC_ANI_ENV === 'production' ? 'production' : 'development',
  base: '/',
  scope: '/',
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
  manifest: {
    id: 'ani-book-quotes',
    name: 'Ani Book Quotes',
    short_name: 'Ani',
    description: 'Ani Book Quotes is social media designed for book lovers!',
    theme_color: '#111827',
    icons: [
      {
        src: 'icons/192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'icons/512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    launch_handler: {
      client_mode: ['auto'],
    },
    orientation: 'portrait',
    screenshots: [{
        src: 'screenshot.png',
        sizes: '2865x1617',
        type: 'image/png',
    }],
    categories: ['productivity', 'social-networking', 'entertainment', 'literature'],
    dir: 'ltr',
    related_applications: [{
      platform: 'play',
      url: 'https://play.google.com/store/apps/details?id=me.guyca.kippi&hl=en_US',
      id: 'me.guyca.kippi',
    }],
    'prefer_related_applications': true,
    scope_extensions: [{ origin: '*.anibookquotes.com' }]
  },
  workbox: {
    runtimeCaching: [{
      handler: 'NetworkOnly',
      urlPattern: /\/api\/.*\/*.json/,
      method: 'POST',
      options: {
        backgroundSync: {
          name: 'aniQueue',
          options: {
            maxRetentionTime: 24 * 60
          }
        }
      }
    }]
  }
};

// https://astro.build/config
export default defineConfig({
	site,
	integrations: [mdx(), sitemap(), AstroPWA(pwaConfig)],
  output: 'server',
  adapter: vercel(),
  server: { port },
  // vite: {
  //   plugins: [mkcert()],
  //   server: {
  //     https: true,
  //   }
  // }
});
