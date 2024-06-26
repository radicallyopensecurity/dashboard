import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: "node_modules/moment/src/moment.js",
        output: {
            file: "web_modules/moment.js"
        }
    },{
        input: "node_modules/marked/src/marked.js",
        output: {
            file: "web_modules/marked.js"
        },
        plugins: [nodeResolve(), commonjs({transformMixedEsModules:true})]
    },{
        input: "node_modules/lit/index.js",
        output: {
            file: "web_modules/lit.js"
        },
        plugins: [nodeResolve()]
    },{
        input: "node_modules/lit/directive.js",
        output: {
            file: "web_modules/lit/directive.js"
        },
        plugins: [nodeResolve()]
    },{
        input: "node_modules/lit/async-directive.js",
        output: {
            file: "web_modules/lit/async-directive.js"
        },
        plugins: [nodeResolve()]
    },{
        input: "node_modules/lit-html/directives/style-map.js",
        output: {
            file: "web_modules/lit-html/directives/style-map.js"
        },
        plugins: [nodeResolve()]
    },{
        input: "node_modules/lit-html/directives/class-map.js",
        output: {
            file: "web_modules/lit-html/directives/class-map.js"
        },
        plugins: [nodeResolve()]
    },{
        input: "node_modules/lit-html/directives/repeat.js",
        output: {
            file: "web_modules/lit-html/directives/repeat.js"
        },
        plugins: [nodeResolve()]
    },{
        input: "node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js",
        output: {
            file: "web_modules/@webcomponents/webcomponentsjs.js"
        }
    }
]