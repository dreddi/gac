import pluginTester from 'babel-plugin-tester';
import * as path from "path"
import plugin from "./plugin.js";


let prep = (code) => ("config = " + code.trim() + ";")

pluginTester({
    plugin: plugin,
    pluginName: "autoconfig-rewriter",
    snapshot: true,
    tests: [
        {
            title: 'empty-autoconfig',
            code: prep(`
{}
            `)
        },
        {
            title: "arrow-function-expression",
            code: prep(`
{
    "target": () => {
        var today = new Date();
        return today.getDay() == 3;
    }
}
                `)
        },
        {
            title: "conditional-expression",
            code: prep(`
{
    "target": parseFloat(this.pair.currentQty) > 0 ? 1 : 2
}
                `)
        }
    ]
})