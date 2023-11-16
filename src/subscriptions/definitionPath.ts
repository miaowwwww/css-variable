import * as vscode from "vscode";
import { database } from "../store/variables";
import { subscriptionScheme } from "../constants/scheme";

export default function subscription(context: vscode.ExtensionContext) {
	// 点击变量定位到文件
	context.subscriptions.push(vscode.languages.registerDefinitionProvider(subscriptionScheme, {
		provideDefinition(document, position, token) {
			// 这个方式竟然拿不到$, 真的恶心
			// const word = document.getText(document.getWordRangeAtPosition(position));

			const line = document.lineAt(position);
			// 输入的颜色值
			const word = line.text.split(':')[1].trim().replace(/[^a-zA-Z0-9\-_$@]/g, '');
			const value = database.get(word);
			if (value) {
				return new vscode.Location(vscode.Uri.file(value.filePath.absolutePath), new vscode.Position(value.source.line - 1, value.source.column - 1));
			}
		}
	}));
};

