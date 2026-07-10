const config = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module-resolver', {
      root: ['./'],
      alias: {
        '@': './',
      }
    }],
    'react-native-reanimated/plugin'
  ]
};

export default config;
