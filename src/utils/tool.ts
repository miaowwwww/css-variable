import vscode from 'vscode';
import * as path from 'path';

export interface SassFilePath {
	absolutePath: string;
	relativePath: string;
}

/**
 * 获取并组装配置上的sass变量文件路径
 * 写在配置中的必须是相对路径
 * 
 * @returns string[] 返回当前配置中的sass文件绝对路径
 */
export function getConfigSassFilesPathList(): SassFilePath[] {
  const config = vscode.workspace.getConfiguration('cssVariable');
	const pathArray: string[] = config.variableFilePath;

	let workspace: string | undefined;
	if (vscode.window.activeTextEditor?.document.uri) {
		workspace = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor?.document.uri)?.uri.fsPath;
	}
	const filePathAbs = pathArray.map((item) => {
		const absolutePath = path.join(workspace || '', item);
		return {
			absolutePath,
			relativePath: item
		}
	});
  return filePathAbs;
}