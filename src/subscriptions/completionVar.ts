import * as vscode from "vscode";
import database from "../store/variables";

const fs = require("fs");

function provideCompletionItems(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken,
  context: vscode.CompletionContext
): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
  const result: vscode.CompletionItem[] = [];
  database.getAll().forEach(item => {
    result.push({
      label: item.name,
      kind: vscode.CompletionItemKind.Variable,
      detail: item.name,
      documentation: `value: ${item.value}\n\nhex-value: ${item.color}`,
    });
  });
  return result;
}


export default function completionVarSubscriptions(context: vscode.ExtensionContext) {
  // 注册代码建议提示，只有当按下“$”时才触发
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "scss",
      {
        provideCompletionItems
      },
      "."
    )
  );
};

