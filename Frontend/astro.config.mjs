import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

const DEV_PORT = 2121;

// https://astro.build/config
export default defineConfig({
    site: `http://localhost:${DEV_PORT}`,
    base: undefined, // Sie können diese Zeile anpassen oder entfernen

    output: 'server',

    server: {
        port: DEV_PORT,
    },
		adapter: vercel(),
    integrations: [
        sitemap(),
        tailwind(),
        react(),
    ],
});
