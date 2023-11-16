import * as vscode from "vscode";
import { database } from "../store/variables";
import { formatHex8 } from 'culori';
import { subscriptionScheme } from "../constants/scheme";

const fs = require("fs");

function provideCompletionItems(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken,
  context: vscode.CompletionContext
): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
  const line = document.lineAt(position);
  // 不是“=”时return
  if (line.text[position.character - 1] !== "=") {
    return;
  }
  // 输入的颜色值
  const word = line.text.split(':')[1].trim().slice(0, -1);
  // 获取颜色的开始位置
  const colorStart = line.text.indexOf(word);

  const wordColorHex8 = formatHex8(word);
  if (!word || !wordColorHex8) {
    return;
  }

  const command = {
    title: "deleteColor",
    command: "cssVariable.deleteColor",
    arguments: [
      {
        line: position.line,
        start: colorStart,
        end: position.character,
      },
    ],
  };

  const result: vscode.CompletionItem[] = [];
  database.getAll().forEach(item => {
    if (wordColorHex8 !== item.colorHex8) {
      return;
    }
    result.push({
      label: item.name,
      detail: item.name,
      kind: vscode.CompletionItemKind.Variable,
      documentation: `value: ${item.value}\n\n -hex8-value: ${item.colorHex8}\n -path: ${item.filePath.relativePath}`,
      // 执行命令，删除前面的字符
      command
    });



    // 这是对biui_color的特殊处理，如果匹配到浅色或者暗夜色，需要补充变量的
    if (
      item.name.indexOf('$_biui_') === 0
      && (item.name.indexOf('--dark') > -1 || item.name.indexOf('--light') > -1)
    ) {
      const varName = item.name.replace('--dark', '').replace('--light', '');
      // 已经加过了，就不要再加了
      if (result.find(item => item.label === varName)) {
        return;
      }
      const varItem = database.get(varName);
      if (!varItem) {
        return;
      }

      const darkItem = database.get(`${varName}--dark`);
      const lightItem = database.get(`${varName}--light`);

      result.push({
        label: varItem.name,
        detail: varItem.name,
        kind: vscode.CompletionItemKind.Variable,
        documentation: `value: ${varItem.value}\n\n -dark-value: ${darkItem?.value}\n -light-value: ${lightItem?.value}\n -dark-hex8-value: ${darkItem?.colorHex8}\n -light-hex8-value: ${lightItem?.colorHex8}\n -path: ${varItem.filePath.relativePath}`,
        // 执行命令，删除前面的字符
        command
      });


    }
  });
  return result;
}


export default function completionVarSubscriptions(context: vscode.ExtensionContext) {
  // 删除文字命令，在eq功能执行后删除颜色， 就是为了completionEq 服务的
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "cssVariable.deleteColor",
      (editor, edit, position) => {
        if (position) {
          edit.delete(
            new vscode.Range(
              new vscode.Position(position.line, position.start),
              new vscode.Position(position.line, position.end)
            )
          );
        }
      }
    ) 
  );
  // 注册代码建议提示，只有当按下“$”时才触发
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      subscriptionScheme,
      {
        provideCompletionItems
      },
      "="
    )
  );
};

