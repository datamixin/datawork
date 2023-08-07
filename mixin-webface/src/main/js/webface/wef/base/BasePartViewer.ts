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
import Director from "webface/wef/Director";
import PartViewer from "webface/wef/PartViewer";
import RootPartViewer from "webface/wef/RootPartViewer";
import BaseDirectorRegistry from "webface/wef/base/BaseDirectorRegistry";

import Control from "webface/widgets/Control";

export abstract class BasePartViewer implements PartViewer {

	private parent: PartViewer = null;
	private children: PartViewer[] = [];
	private directorRegistry = new BaseDirectorRegistry();

	public setParent(parent: PartViewer): void {

		this.parent = parent;

		// Tambahkan viewer ini menjadi anakan dari parent.
		let basePartViewer = <BasePartViewer>parent;
		for (let child of basePartViewer.children) {
			if (child instanceof this.constructor) {
				let index = basePartViewer.children.indexOf(child);
				basePartViewer.children.splice(index, 1);
			}
		}
		basePartViewer.children.push(this);
	}

	public getParent(): PartViewer {
		return this.parent;
	}

	public getControl(): Control {
		throw new Error("BaseControllerViewer has no control");
	}

	public getRootViewer(): RootPartViewer {
		let parent = this.getParent();
		if (parent !== null) {
			return parent.getRootViewer();
		}
		return null;
	}

	public getChildren(): PartViewer[] {
		return this.children;
	}

	public registerDirector(key: string, director: Director): void {
		this.directorRegistry.register(key, director);
	}

	public getDirector(key: string): Director {
		let director = this.directorRegistry.get(key) || null;
		if (director !== null) {
			return director;
		}
		if (this.parent !== null) {
			return this.parent.getDirector(key);
		}
		return null;
	}

	public getDirectors(): Director[] {
		let directors: Director[] = [];
		let keys = this.directorRegistry.getKeys();
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let director = this.directorRegistry.get(key);
			directors.push(director);
		}
		return directors;
	}

}

export default BasePartViewer;