const { defineConfig } = require("@vue/cli-service");
require("dotenv").config({path:__dirname+'/../.env'});

serverPort = `http://127.0.0.1:${process.env.PORT}`

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        port: 8080,
        host: "0.0.0.0",
        proxy: {
            "^/api": {
                target: serverPort,
                changeOrigin: true,
            },
            "^/fedapi": {
                target: serverPort,
                changeOrigin: true,
            },
        },
    },
});
