import * as fs from 'fs';
import path from  'path';
// import * as sass from  'sass';
// import * as daftSass from  "dart-sass";
// import postcssScss from  'postcss-scss';


export function sassToJson(filePath: string) {

  // 编译 SCSS 文件并获取编译结果
  // const result = sass.compile(filePath);
  console.log('12313');

  // 读取临时文件内容
  const cssContent = fs.readFileSync(filePath, 'utf-8');

  // const ast = postcssScss.parse(cssContent);

  // ast.walkDecls((decl) => {
  //   if (decl.prop.startsWith('--')) {
  //     const variable: CSSVariable = {
  //       symbol: {
  //         name: decl.prop,
  //         value: decl.value,
  //       },
  //       definition: {
  //         uri: fileURI,
  //         range: Range.create(
  //           Position.create(
  //             decl.source.start.line - 1,
  //             decl.source.start.column - 1
  //           ),
  //           Position.create(
  //             decl.source.end.line - 1,
  //             decl.source.end.column - 1
  //           )
  //         ),
  //       },
  //     };

  //     if (isColor(decl.value)) {
  //       const culoriColor = culori.parse(decl.value);
  //       if (culoriColor) {
  //         variable.color = culoriColorToVscodeColor(culoriColor);
  //       }
  //     }

  //     // add to cache
  //     this.cacheManager.set(filePath, decl.prop, variable);
  //   }
  // });

  // console.log('parseContent = ', parseContent);
  // const varList = parseContent.nodes.filter(node => node.type === 'decl' && node.prop.startsWith('$'));


  // 正则表达式匹配 SCSS 变量
  const matches = cssContent.match(/\$([\w-]+):\s*([^;]*);/g);

  if (!matches) {

    return {};
  }

  // 构建变量对象
  const variables: any = {};
  matches.forEach(match => {
    const result = match.match(/\$([\w-]+):\s*(.*);/);
    if (!result) {
      return ;
    }
    const [, variableName, variableValue] = result;
    variables[variableName] = variableValue;
  });
  console.log('variables = ', variables);

  return variables;
}
