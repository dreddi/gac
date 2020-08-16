import * as fs from "fs";
import *  as filepath from "path";

import * as parser from "@babel/parser";
import * as types from "@babel/types";
import * as babel from "@babel/core";
import minimist from "minimist";

import plugin from "./plugin.js";


module.exports = () => {

	var argv = minimist(process.argv.slice(2));
	const fileToTransform = argv._[0]

	if (!fs.existsSync(fileToTransform)) {
		console.error(`File ${fileToTransform} does not exist.`)
		return
	}

	fs.readFile(fileToTransform, {encoding: 'utf8'}, function (err, data) {

		let autoconfig;
		try {
			autoconfig = parser.parseExpression(data);
		} catch(err) {

			throw SyntaxError("Expected a JSON-like {...} object expression. " + err + " " + data);
		}

		// Get the JSON-like object into a shape that can be parsed like a javascript file
		autoconfig = types.program([
						types.variableDeclaration("const", 
							[
							types.variableDeclarator(
								types.identifier("_gunbotacgen"),
								autoconfig
							)
							]
						)
					])

		// parse it like a javscript file, using our custom plugin
		babel.transformFromAst(autoconfig, null, {plugins: [plugin]}, function(err, result) {
			
			if(err){
				console.log(err);
				return;
			}
			
			// Undo the earlier shaping of the JSON-like object
			const removeShim = (code) => {
				// Remove the first line "const _gunbotacgen = {" and replace it with "{"
				let lines = code.split('\n');
				lines.splice(0, 1, "{");

				// Remove the last line "};" and replace it with "}"
				lines.splice(lines.length - 1,1, "}");
				return lines.join('\n');
			}

			// finish up
			fs.writeFile(filepath.dirname(fileToTransform) + "/autoconfig.json", removeShim(result.code), {}, (err) => {
				if(err){
					console.log(err);
					return;
				}
				console.log("New autoconfig written to " + filepath.dirname(fileToTransform) + "/autoconfig.json");

			});
		});
	});

}



