import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        proxy: {
            '/api': {
                target: 'http://minegauler.lewisgaul.co.uk',
                changeOrigin: true,

                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        console.log(`Proxying request to: ${proxyReq.path}`);
                    });
                }
            }
        }
    }
});