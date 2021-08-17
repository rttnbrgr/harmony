module.exports = {
  presets: ["@babel/preset-env"],
  plugins: [
    [
      "babel-plugin-styled-components",
      {
        ssr: false,
      },
    ],
  ],
};
