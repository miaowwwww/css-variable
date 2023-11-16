import * as vscode from "vscode";
import { database } from "../store/variables";

function provideCompletionItems(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken,
  context: vscode.CompletionContext
): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
  const result: vscode.CompletionItem[] = [];
  database.getAll().forEach(item => {
    let documentation = `value: ${item.value} ${item.colorHex8 ? `\n\n -hex8-value: ${item.colorHex8}` : ''}`;

    // 这是对biui_color的特殊处理，如果是变量，需要补充暗夜和浅色的说明
    if (item.name.indexOf('$_biui_') === 0 && item.name.indexOf('--') === -1) {
      const darkItem = database.get(`${item.name}--dark`);
      const lightItem = database.get(`${item.name}--light`);

      documentation = `value: ${item.value}\n\n -dark-value: ${darkItem?.value}\n -light-value: ${lightItem?.value}\n -dark-hex8-value: ${darkItem?.colorHex8}\n -light-hex8-value: ${lightItem?.colorHex8}`;
    }

    result.push({
      label: item.name,
      kind: vscode.CompletionItemKind.Variable,
      detail: item.name,
      documentation
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
      "$"
    )
  );
};

