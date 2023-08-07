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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ListViewer from "webface/viewers/ListViewer";
import ListViewerStyle from "webface/viewers/ListViewerStyle";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import XText from "sleman/model/XText";
import XList from "sleman/model/XList";

import NameListSupport from "padang/dialogs/guide/NameListSupport";
import SlemanFactory from "sleman/model/SlemanFactory";

export default class NameListCheckViewerPanel {

	private support: NameListSupport = null;
	private list: XList = null;
	private viewer: ListViewer = null;

	constructor(support: NameListSupport, list: XList) {
		this.support = support;
		this.list = list === undefined ? null : list;
	}

	public createControl(parent: Composite, index?: number): void {
		let style = <ListViewerStyle>{
			mark: ListViewerStyle.CHECK
		}
		this.viewer = new ListViewer(parent, style, index);
		this.viewer.addSelectionChangedListener(<SelectionChangedListener>{
			selectionChanged: (event: SelectionChangedEvent) => {

				let selection = event.getSelection();
				if (!selection.isEmpty()) {

					let checked = this.viewer.getChecked();
					let elements = this.list.getElements();
					for (let element of elements.toArray()) {
						let text = <XText>element;
						let value = text.getValue();
						if (checked.indexOf(value) === -1) {
							elements.remove(text);
						}
					}
					for (let item of checked) {
						let exists = false;
						for (let element of elements.toArray()) {
							let text = <XText>element;
							let value = text.getValue();
							if (item === value) {
								exists = true;
								break;
							}
						}
						if (!exists) {
							let factory = SlemanFactory.eINSTANCE;
							let text = factory.createXText(item);
							elements.add(text);
						}
					}
				}

			}
		});
		this.support.load((names: string[]) => {

			this.viewer.setInput(names);

			let elements = this.list.getElements();
			let checked: string[] = [];
			for (let element of elements) {
				let text = <XText>element;
				let value = text.getValue();
				checked.push(value);
			}
			this.viewer.setChecked(checked);
		});
	}

	public getControl(): Control {
		return this.viewer;
	}

}