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

import LabelTextPanel from "webface/ui/LabelTextPanel";

import VisageValue from "bekasi/visage/VisageValue";
import VisageConstant from "bekasi/visage/VisageConstant";

import * as view from "padang/view/view";

import GridValuePanel from "padang/grid/GridValuePanel";

import DataFormContentPanel from "padang/view/instore/DataFormContentPanel";

export default class DataFormCellPanel extends DataFormContentPanel implements GridValuePanel {

    private composite: Composite = null;
    private valuePanel = new LabelTextPanel();
    private rowPos: number = null;
    private columnPos: number = null;
    private onPreEdit = () => { };
    private onPostCommit = () => { };

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);
        view.setGridLayout(this.composite, 1, 0, 0);

        this.createValuePanel(this.composite);

    }

    private createValuePanel(parent: Composite): void {

        this.valuePanel.createControl(parent);
        this.valuePanel.onEdit(() => {
            this.onPreEdit();
        });
        this.valuePanel.onCommit((newText: string, oldText: string) => {
            this.provider.updateCell(this.rowPos, this.columnPos, newText);
            this.onPostCommit();
        });
        view.setGridData(this.valuePanel, true, true);

    }

    public setValue(rowPos: number, columnPos: number, value: VisageValue): void {
        this.rowPos = rowPos;
        this.columnPos = columnPos;
        if (value instanceof VisageConstant) {
            let result = value.getValue();
            this.valuePanel.setText(result);
            view.css(this.valuePanel, "text-align", typeof (result) === "number" ? "right" : "left");
        }
    }

    public setOnPreEdit(callback: () => void): void {
        this.onPreEdit = callback;
    }

    public setOnPostCommit(callback: () => void): void {
        this.onPostCommit = callback;
    }

    public setSelected(selected: boolean): void {
        this.valuePanel.setEditOnFocus(selected);
    }

    public setEditMode(edit: boolean, position: number | boolean, value?: string): void {
        this.valuePanel.setShowEdit(true, position);
        if (value !== undefined) {
            this.valuePanel.setText(value);
        }
    }

    public delayValue(): void {
        this.valuePanel.setText("");
    }

    public commit(): void {
        this.valuePanel.commit();
    }

    public getControl(): Control {
        return this.composite;
    }

}