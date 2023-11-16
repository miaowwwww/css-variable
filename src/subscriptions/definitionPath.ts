import * as vscode from "vscode";
import { database } from "../store/variables";

export default function subscription(context: vscode.ExtensionContext) {
	// 点击变量定位到文件
	context.subscriptions.push(vscode.languages.registerDefinitionProvider(['scss'], {
		provideDefinition(document, position, token) {
			const word = document.getText(document.getWordRangeAtPosition(position));
			const value = database.get(word);
			if (value) {
				return new vscode.Location(vscode.Uri.file(value.filePath.absolutePath), new vscode.Position(value.source.line - 1, value.source.column - 1));
			}
		}
	}));
};

