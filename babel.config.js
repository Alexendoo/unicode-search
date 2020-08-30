module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    android: "84",
                    chrome: "70",
                    edge: "84",
                    firefox: "80",
                    ios: "12",
                    safari: "12",
                },
            },
        ],
    ],
};
