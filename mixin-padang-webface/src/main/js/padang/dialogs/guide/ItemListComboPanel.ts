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
import Combo from "webface/widgets/Combo";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import XText from "sleman/model/XText";

export default class NameListComboPanel {

	private items: string[] = [];
	private name: XText = null;
	private combo: Combo = null;

	constructor(items: string[], name: XText) {
		this.items = items;
		this.name = name === undefined ? null : name;
	}

	public createControl(parent: Composite, index?: number): void {
		this.combo = new Combo(parent, index);
		this.combo.setItems(this.items);
		this.combo.onChanged((text: string) => {
			if (this.getCurrentName() !== text) {
				this.name.setValue(text);
			}
		});
		let name = this.getCurrentName();
		this.combo.setSelectionText(name);
	}

	private getCurrentName(): string {
		let name = this.name.getValue();
		return name;
	}

	public getControl(): Control {
		return this.combo;
	}

}