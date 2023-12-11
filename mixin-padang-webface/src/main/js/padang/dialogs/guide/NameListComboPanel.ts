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
import Combo from "webface/widgets/Combo";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import XText from "sleman/model/XText";
import XReference from "sleman/model/XReference";
import XIdentifier from "sleman/model/XIdentifier";

import NameListSupport from "padang/dialogs/guide/NameListSupport";

export default class NameListComboPanel {

	private support: NameListSupport = null;
	private name: XText | XReference | XIdentifier = null;
	private combo: Combo = null;
	private onChange: (name: string) => void = () => { };

	constructor(support: NameListSupport, name: XText | XReference | XIdentifier) {
		this.support = support;
		this.name = name === undefined ? null : name;
	}

	public createControl(parent: Composite, index?: number): void {

		this.combo = new Combo(parent);
		this.support.load((names: string[]) => {
			this.combo.setItems(names);
			if (this.name !== null) {
				let text = this.getCurrentName();
				this.combo.setSelectionText(text);
			}
		});

		this.combo.onChanged((text: string) => {
			if (this.getCurrentName() !== text) {
				if (this.name instanceof XReference) {
					this.name.setName(text);
				} else if (this.name instanceof XIdentifier) {
					this.name.setName(text);
				} else {
					(<XText>this.name).setValue(text);
				}
				this.onChange(text);
			}
		});

	}

	private getCurrentName(): string {
		let name: string = null;
		if (this.name instanceof XReference) {
			name = this.name.getName();
		} else if (this.name instanceof XIdentifier) {
			name = this.name.getName();
		} else {
			name = (<XText>this.name).getValue();
		}
		return name;
	}

	public setOnChange(callback: (name: string) => void): void {
		this.onChange = callback;
	}

	public getControl(): Control {
		return this.combo;
	}

}