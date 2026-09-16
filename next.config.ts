import type { NextConfig } from 'next';
const config: NextConfig = { output: 'export', images: { loader: 'custom', loaderFile: './app/image-loader.ts' }, turbopack: { root: process.cwd() } };
export default config;
