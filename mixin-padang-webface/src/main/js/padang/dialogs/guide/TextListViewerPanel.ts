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

import Selection from "webface/viewers/Selection";
import ListViewer from "webface/viewers/ListViewer";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import XText from "sleman/model/XText";

export default class TextListViewerPanel {

    private text: XText = null;
    private viewer: ListViewer = null;

    constructor(text: XText) {
        this.text = text === undefined ? null : text;
    }

    public createControl(parent: Composite, index?: number): void {
        this.viewer = new ListViewer(parent);
        this.viewer.addSelectionChangedListener(<SelectionChangedListener>{
            selectionChanged: (event: SelectionChangedEvent) => {
                let selection = event.getSelection();
                if (!selection.isEmpty()) {
                    let value = <string>selection.getFirstElement();
                    this.text.setValue(value);
                }
            }
        });
    }

    public setItems(items: string[]): void {
        this.viewer.setInput(items);
        let value = this.text.getValue();
        let selection = new Selection(value);
        this.viewer.setSelection(selection);
    }

    public getControl(): Control {
        return this.viewer;
    }

}