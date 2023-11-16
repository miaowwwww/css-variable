import CacheManager from "../utils/cacheManager";
import { sassToJson } from "../utils/sassToJson";
import { SassFilePath, getConfigSassFilesPathList } from "../utils/tool";
import fs from 'fs';

export const database = new CacheManager();


let filePathAbs: SassFilePath[] = [];
let watcher: fs.FSWatcher[] = [];


function refresh() {
  database.clearAllCache();

  filePathAbs = getConfigSassFilesPathList();
  filePathAbs.forEach(path => {
    const list = sassToJson(path);
    database.setFormList(path.relativePath, list);
  });
}

// function watch() {
//   watcher = filePathAbs.map(filePath => {
//     return fs.watch(filePath.absolutePath, (event) => {
//       if (event === 'change') {
//         refresh();
//       }
//     });
//   });
// }

// function watcherClose() {
//   watcher.forEach(item => item.close());
//   watcher = [];
// }

function init() {
  // 需要补充一个逻辑，就是当用户修改了配置文件的时候，需要重新读取配置文件然后重新更新database
  refresh();
  // 监听变量文件变化，重新读取文件
  // watch();
}


export default {
  database,
  init,
  // watcherClose,
  refresh,
};
