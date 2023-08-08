import * as vscode from "vscode";
import { sassToJson } from '../utils/sassToJson';
import * as path from "path";

const fs = require("fs");

function provideHover(
  document: vscode.TextDocument,
  position: vscode.Position
) {
  // 查询字符
  const word = document.getText(document.getWordRangeAtPosition(position));


  let workspace: string | undefined;
  if (document) {
    workspace = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath;
  }
  console.log('document = ', document);
  console.log('workspace = ', workspace);

  const filePath = `/Users/guodequan/work/test-project/${'src/sassToJsonTest.scss'}`;
  console.log('filepath = ', filePath);

  sassToJson(filePath);


  return new vscode.Hover(`hello world ${word}`);

}

export default function hoverSubscriptions (context: vscode.ExtensionContext) {
  // 注册鼠标悬停提示
  context.subscriptions.push(
    vscode.languages.registerHoverProvider("scss", {
      provideHover,
    })
  );
};
