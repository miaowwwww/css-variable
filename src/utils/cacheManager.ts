/**
 * Cache Manager
 * 
 * cachedVariables: {
 *    src/styles/variables.css: {
 *        $red: cssVariable,
 *    }
 * }
 *   allVariables: {
 * 			$red: cssVariable,
 *      $green: cssVariable
 * 	 }
 */

import type { CSSVariable } from '../utils/sassToJson';

export default class CacheManager<T extends CSSVariable> {
	private cachedVariables: Map<string, Map<string, T>> = new Map();
	private allVariables: Map<string, T> = new Map();

	public get(key: string, filePath?: string) {
		if (filePath) {
			return this.cachedVariables.get(filePath)?.get(key);
		}

		return this.allVariables?.get(key);
	}

	public getAll() {
		return this.allVariables;
	}

	public setFormList(filePath: string, list: T[]) {
		list.forEach((item) => {
			this.set(filePath, item.name, item);
		});
	}

	public set(filePath: string, key: string, value: T) {
		if (!this.cachedVariables.get(filePath)) {
			this.cachedVariables.set(filePath, new Map());
		}

		this.allVariables?.set(key, value);
		this.cachedVariables.get(filePath)?.set(key, value);
	}

	public clearFileCache(filePath: string) {
		this.cachedVariables.get(filePath)?.forEach((value, key) => {
			this.allVariables?.delete(key);
		});
		this.cachedVariables.get(filePath)?.clear();
	}

	public clearAllCache() {
		this.allVariables?.clear();
		this.cachedVariables.clear();
	}
}