/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import EHolder from "webface/model/EHolder";
import EMapEntry from "webface/model/EMapEntry";

export abstract class EMap<V> extends EHolder {

	public abstract containsKey(key: string): boolean;

	public abstract get(key: string): V;

	public abstract put(key: string, value: V): void;

	public abstract putAll(map: EMap<V>): void;

	public abstract keySet(): string[];

	public abstract entries(): EMapEntry<V>[];

	public abstract valueMap(): { [key: string]: any };

	/**
	 * Remove terlebih dahulu element dari container sebelumnya.
	 * @param value
	 */
	public abstract delete(value: V): void;

	public abstract removeChild(value: V): void;

	public abstract remove(key: string): void;

	public abstract size(): number;

	public abstract clear(): void;

	public abstract removeValue(value: V): void;

	public abstract repopulate(entries: { [key: string]: any }): void;

}

export default EMap;
