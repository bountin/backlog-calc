'use strict';

const fs = require('fs');
const path = require('path');
const walk = require('fs-walk');
const babel = require('babel-core');
const util = babel.util;

const sourceDirectory = process.argv[2];
const messagesDirectory = process.argv[3];
const forceLanguage = process.argv[4];

let messages = [];
walk.walkSync(sourceDirectory, (baseDir, fileName, stat) => {
	const filePath = path.resolve(baseDir, fileName);
	if (!util.canCompile(filePath)) {
		return;
	}

	const result = babel.transformFileSync(filePath, { plugins : ['react-intl'] });
	messages = messages.concat(result.metadata['react-intl'].messages);
});

messages = messages.reduce((object, message) => {
	object[message.id] = message.defaultMessage;
	return object;
}, {});

walk.walkSync(messagesDirectory, (baseDir, fileName, stat) => {
	if (!fileName.match(/\.json$/)) {
		return;
	}

	const filePath = path.resolve(baseDir, fileName);
	const oldMessages = require(filePath);

	const fileLanguage = path.basename(fileName, '.json');
	const shouldNotOverwrite = (forceLanguage !== fileLanguage);

	const newMessages = {};
	for (const key in messages) {
		newMessages[key] = (shouldNotOverwrite && oldMessages[key]) || messages[key];
	}

	const hasChanged = JSON.stringify(newMessages) !== JSON.stringify(oldMessages);
	if (hasChanged) {
		fs.writeFileSync(filePath, JSON.stringify(newMessages, null, '\t'));
		console.log('[\u2713]', fileName, 'updated');
	} else {
		console.log('[ ]', fileName, 'unchanged');
	}
});
