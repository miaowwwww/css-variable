import * as fs from 'fs';
// import path from  'path';
// import * as sass from  'sass';
// import * as daftSass from  "dart-sass";
import postcssScss from  'postcss-scss';
import { Range, Color, Location, Position } from 'vscode';

export interface CSSVariable {
  name: string;
  value: string;
  color: string;
  uri: string;
  source: {
    column: number;
    line: number;
  }
}

export function sassToJson(filePath: string):CSSVariable[] {
  // 读取临时文件内容
  const cssContent = fs.readFileSync(filePath, 'utf-8');

  const ast = postcssScss.parse(cssContent);

  const list: CSSVariable[] = [];

  ast.walkDecls((decl) => {
    if (decl.prop.startsWith('$')) {
      const variable = {
        name: decl.prop,
        value: decl.value,
        color: '', // 这个是颜色值，用来做16进制和rgba的对比
        uri: filePath, // filePath 预留字段

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
