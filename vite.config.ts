import rawPlugin from 'vite-raw-plugin';

export default {
  base: '/leaf-js/', // Replace 'leaf-js' with your repository name
  plugins: [
    rawPlugin({
      fileRegex: /\.wgsl$/,
    }),
  ],
};