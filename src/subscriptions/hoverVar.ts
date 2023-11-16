import * as vscode from "vscode";
import { database } from "../store/variables";
import { subscriptionScheme } from "../constants/scheme";

export default function subscription(context: vscode.ExtensionContext) {
	// 鼠标悬浮在变量上的时候，显示变量的值
	context.subscriptions.push(
		vscode.languages.registerHoverProvider(
			subscriptionScheme,
			{
				provideHover(document, position, token) {
					// 这个方式竟然拿不到$, 真的恶心
					// const word = document.getText(document.getWordRangeAtPosition(position));

					const line = document.lineAt(position);
					// 输入的颜色值
					const word = line.text.split(':')[1].trim().replace(/[^a-zA-Z0-9\-_$@]/g, '');
					const value = database.get(word);
					if (value) {
						return new vscode.Hover(`${value.value}`);
					}
				}
			}
		)
	);
};

