// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import databaseManager from './store/variables';
import completionVar from './subscriptions/completionVar';
import completionEq from './subscriptions/completionEq';
import hoverVar from './subscriptions/hoverVar';
import definitionPath from './subscriptions/definitionPath';

export function activate(context: vscode.ExtensionContext) {
	// 需要补充一个逻辑，就是当用户修改了配置文件的时候，需要重新读取配置文件然后重新更新database
	databaseManager.init();

	// 监听文件变化，重新读取文件
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
		databaseManager.refresh();
	}));

	// 注册代码建议提示，只有当按下“$”时才触发
	completionVar(context);

	// 在色值中添加=时，提示变量
	completionEq(context);

	// 鼠标悬浮在变量上的时候，显示变量的值
	hoverVar(context);

	// 点击变量定位到文件
	definitionPath(context);

}

// This method is called when your extension is deactivated
export function deactivate() { }
