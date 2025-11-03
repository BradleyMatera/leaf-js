import rawPlugin from 'vite-raw-plugin';

export default {
  base: '/leaf-js/',
  plugins: [
    rawPlugin({
      fileRegex: /\.wgsl$/,
    }),
  ],
};