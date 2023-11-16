import * as vscode from "vscode";
import { database } from "../store/variables";

export default function subscription(context: vscode.ExtensionContext) {
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
};

