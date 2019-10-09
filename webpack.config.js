let path = require("path");
let copy_plugin = require("copy-webpack-plugin");

module.exports = [
    /**
     * Backend Code Bundling
     */
    {
        entry: path.join(__dirname, "src", "backend", "main.ts"),
        target: "node",
        node: {
            __dirname: false
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        output: {
            filename: "server.js",
            path: path.join(__dirname, "dist", "backend")
        }
    },

    /**
     * Frontend Code Bundling
     */
    {
        entry: {
            index: path.join(
                __dirname,
                "src",
                "frontend",
                "scripts",
                "index.ts"
            ),
            config: path.join(
                __dirname,
                "src",
                "frontend",
                "scripts",
                "config.ts"
            )
        },
        output: {
            filename: "[name].js",
            path: path.join(__dirname, "dist", "frontend", "scripts")
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        plugins: [
            new copy_plugin([
                {
                    from: path.join(__dirname, "src", "frontend", "pages"),
                    to: path.join(__dirname, "dist", "frontend")
                },
                {
                    from: path.join(__dirname, "src", "frontend", "libs"),
                    to: path.join(__dirname, "dist", "frontend", "libs")
                }
            ])
        ]
    }
];
