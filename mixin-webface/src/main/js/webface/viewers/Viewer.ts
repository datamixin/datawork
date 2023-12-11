/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>. */
import Control from "webface/widgets/Control";

import Selection from "webface/viewers/Selection";
import SelectionProvider from "webface/viewers/SelectionProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

export abstract class Viewer extends Control implements SelectionProvider {

	private selectionChangedListeners: SelectionChangedListener[] = [];

	private selection: Selection = null;

	protected notifySelectionChangedListener(elements: any[]): void {
		this.selection = new Selection(elements);
		this.selectionChangedListeners.forEach((listener) => {
			let event = new SelectionChangedEvent(this, this.selection);
			listener.selectionChanged(event);
		});
	}

	public setSelection(selection: Selection, _compareFn?: (a: any, b: any) => boolean): void {
		if (this.selection !== selection) {
			if (selection !== null) {
				let elements = selection.toArray();
				this.notifySelectionChangedListener(elements);
			}
			this.selection = selection;
		}
	}

	public getSelection(): Selection {
		return this.selection;
	}

	public addSelectionChangedListener(listener: SelectionChangedListener): void {
		this.selectionChangedListeners.push(listener);
	}

	public removeSelectionChangedListener(listener: SelectionChangedListener): void {
		let index = this.selectionChangedListeners.indexOf(listener);
		this.selectionChangedListeners.splice(index, 1);
	}
}

export default Viewer;

