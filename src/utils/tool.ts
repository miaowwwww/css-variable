import vscode from 'vscode';
import * as path from 'path';

// 获得less文件路径数组,${folder}转为工作文件夹路径
export function getLocations(document?: vscode.TextDocument) {
  let workspace: string | undefined;
  if (document) {
    workspace = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath;
  }

  const handlePath = (paths: string[]) => {
    return paths.map((v) => {
      if (workspace) {
        return path.join(v.replace("${folder}", workspace));
      } else {
        return path.join(v);
      }
    });
  };
  const locations: string | string[] | undefined = vscode.workspace
    .getConfiguration()
    .get("lessVars.locations");
  if (typeof locations === "string") {
    return handlePath([locations]);
  } else if (locations instanceof Array) {
    return handlePath(locations);
  } else {
    return false;
  }
}