import vscode from 'vscode';
import * as path from 'path';

/**
 * 放回当前配置中的sass文件绝对路径
 * @returns string[]
 */
export function getSassFilesPath(): string[] {
  const config = vscode.workspace.getConfiguration('cssVariable');
	const pathArray: string[] = config.variableFilePath;

	let workspace: string | undefined;
	if (vscode.window.activeTextEditor?.document.uri) {
		workspace = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor?.document.uri)?.uri.fsPath;
	}
	const filePathAbs = pathArray.map((item) => {
		return path.join(workspace || '', item);
	});
  return filePathAbs;
}