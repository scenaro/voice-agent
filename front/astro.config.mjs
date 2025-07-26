import preact from '@astrojs/preact';
import bun from "@hedystia/astro-bun";
import icon from 'astro-icon';
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

const NODE_ENV = process.env.NODE_ENV;

if (!NODE_ENV) {
  throw new Error("NODE_ENV not found in environment variables");
}

if (!await Bun.file('.env.' + NODE_ENV).exists()) {
  throw new Error(`File .env.${NODE_ENV} not found`);
}

console.log(`NODE_ENV: ${NODE_ENV} -> .env.${NODE_ENV} loaded`);

const isProd = NODE_ENV === 'production';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: bun(),

  integrations: [
    icon({
      include: {
        mdi: ["*"],
        lucide: ["*"],
      },
    }),
    preact({
      compat: true, devtools: NODE_ENV === "development", babel: {
        plugins: [
          !isProd && '@babel/plugin-transform-react-jsx-source',
        ].filter(Boolean),
      }
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    validateSecrets: true,
    schema: {
      NODE_ENV: envField.enum({
        context: 'client',
        access: "public",
        values: ["development", "production"]
      }),
      APP_ENV: envField.enum({
        context: 'client',
        access: "public",
        values: ["dev", "prod", "test"],
        optional: true,
      }),
      LIVEKIT_URL: envField.string({ context: "client", access: "public", url: true }),
      LIVEKIT_API_KEY: envField.string({ context: "server", access: "secret" }),
      LIVEKIT_API_SECRET: envField.string({ context: "server", access: "secret" }),
    },
  },
  server: {
    host: true,//process.env.DEV, // only in dev mode
    allowedHosts: ["localhost", "127.0.0.1", "0.0.0.0", "tnicolasgo4321.share.zrok.io"],
  },
});