/* global require, process, module  */
'use strict';

var fs = require('fs'),
	path = require('path');

function DotConfig(filepath) {

	var options = null;

	function readFile(filepath) {

		var rawData = '{}';

		try {
			rawData = fs.readFileSync(filepath);
		} catch(err) {
			if (err.code === 'ENOENT') {
				fs.writeFileSync(filepath, rawData);
			} else {
				throw err;
			}
		}

		try {
			var options = JSON.parse(rawData);
		} catch(err) {
			err.filepath = filepath;
			throw err;
		}

		return options;

	}

	this.set = function(key, value) {
		options = options || readFile(filepath);
		options[key] = value;
		fs.writeFileSync(filepath, JSON.stringify(options, null, 2));
		return this;
	};

	this.get = function(key, callback) {
		options = options || readFile(filepath);
		if (key in options) {
			return options[key];
		} else {
			callback(key);
		}
	};

}

module.exports = module.exports || {};

module.exports.file = function(filename) {

	if (!filename || typeof filename !== typeof '') {
		throw new Error('Invalid filename');
	}

	var homedir = process.env.HOME || process.env.USERPROFILE,
		filepath = path.join(homedir, filename);

	return new DotConfig(filepath);
};