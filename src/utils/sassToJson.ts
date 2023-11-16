import * as fs from 'fs';
// import path from  'path';
// import * as sass from  'sass';
// import * as daftSass from  "dart-sass";
import postcssScss from  'postcss-scss';
import { Range, Color, Location, Position } from 'vscode';
import { parse, formatHex8 } from 'culori';
import { SassFilePath } from './tool';

export interface CSSVariable {
  // 变量名
  name: string;
  // 变量值
  value: string;
  // 变量值的16进制色值 - 如果值不是color，那么这个值就是undefined
  colorHex8: string | undefined;
  // 源文件地址
  filePath: SassFilePath;
  // 在源文件的位置
  source: {
    column: number;
    line: number;
  }
}

export function sassToJson(filePath: SassFilePath):CSSVariable[] {
  // 读取临时文件内容
  const cssContent = fs.readFileSync(filePath.absolutePath, 'utf-8');

  const ast = postcssScss.parse(cssContent);

  const list: CSSVariable[] = [];

  ast.walkDecls((decl) => {
    if (decl.prop.startsWith('$')) {
      const variable:CSSVariable = {
        name: decl.prop,
        value: decl.value,
        colorHex8: formatHex8(decl.value),
        filePath: filePath,
        
        // 这个是用来做跳转的
        source: {
          column: decl.source?.start?.column || 0,
          line: decl.source?.start?.line  || 0,
        }
      };
      list.push(variable);
    }
  });

  return list;
}
