// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import { sassToJson } from './utils/sassToJson';

import completionVar from './subscriptions/completionVar';
import database from './store/variables';
import { getSassFilesPath } from './utils/tool';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// 需要补充一个逻辑，就是当用户修改了配置文件的时候，需要重新读取配置文件然后重新更新database
	const filePathAbs = getSassFilesPath();
	filePathAbs.forEach(path => {
		const list = sassToJson(path);
		database.setFormList(path, list);
	});

	// 监听文件变化，重新读取文件
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
		const filePathAbs = getSassFilesPath();
		database.clearAllCache();

		filePathAbs.forEach(path => {
			const list = sassToJson(path);
			database.setFormList(path, list);
		});
	}));

	// 注册代码建议提示，只有当按下“$”时才触发
	completionVar(context);

	// 鼠标悬浮在变量上的时候，显示变量的值
	context.subscriptions.push(
		vscode.languages.registerHoverProvider('scss', {
			provideHover(document, position, token) {
				const word = document.getText(document.getWordRangeAtPosition(position));
				const value = database.get(word);
				if (value) {
					return new vscode.Hover(`${value.value}`);
				}
			}
		})
	);

	// 点击变量定位到文件
	context.subscriptions.push(vscode.languages.registerDefinitionProvider(['scss'], {
		provideDefinition(document, position, token) {
			const word = document.getText(document.getWordRangeAtPosition(position));
			const value = database.get(word);
			if (value) {
				return new vscode.Location(vscode.Uri.file(value.uri), new vscode.Position(value.source.line - 1, value.source.column - 1));
			}
		}
	}));

	// 输入色值，自动提示变量名
	


}

// This method is called when your extension is deactivated
export function deactivate() { }
