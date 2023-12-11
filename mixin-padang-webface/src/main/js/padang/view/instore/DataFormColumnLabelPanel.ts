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
import Composite from "webface/widgets/Composite";

import MessageDialog from "webface/dialogs/MessageDialog";

import * as view from "padang/view/view";
import MenuPanel from "padang/view/MenuPanel";
import ViewAction from "padang/view/ViewAction";
import NameMenuPanel from "padang/view/NameMenuPanel";
import * as TypeDecoration from "padang/view/TypeDecoration";
import DefaultColumnLabel from "padang/view/DefaultColumnLabel";

import GridControlStyle from "padang/grid/GridControlStyle";
import GridColumnLabelPanel from "padang/grid/GridColumnLabelPanel";

import DataFormContentPanel from "padang/view/instore/DataFormContentPanel";

export default class DataFormColumnLabelPanel extends DataFormContentPanel implements GridColumnLabelPanel {

    private composite: Composite = null;
    private typePanel = new MenuPanel();
    private nameMenuPanel = new NameMenuPanel();
    private selected: boolean = false;
    private onSelection = (control: Control) => { };

    public createControl(parent: Composite, index?: number) {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("data-form-column-label-panel");

        this.composite.onSelection(() => {
            if (this.selected === false) {
                this.onSelection(this.composite);
            }
        });

        view.setGridLayout(this.composite, 2, 3, 0, 0, 0);
        this.createTypePanel(this.composite);
        this.createNameMenuPanel(this.composite);
    }

    private createTypePanel(parent: Composite): void {
        this.typePanel.createControl(parent);
        this.typePanel.setActions([
            this.createTypeAction("String", "string"),
            this.createTypeAction("Number", "float64"),
            this.createTypeAction("Boolean", "bool"),
        ]);
    }

    private createTypeAction(label: string, name: string): ViewAction {
        let callback = () => {
            let column = this.nameMenuPanel.getName();
            this.provider.chanceColumnType(column, name);
        }
        return new ViewAction(label, callback, TypeDecoration.ICON_MAP[name]);
    }

    private createNameMenuPanel(parent: Composite): void {

        this.nameMenuPanel.createControl(parent);
        this.nameMenuPanel.setMenuActions([
            new ViewAction("Remove", () => {
                let name = this.nameMenuPanel.getName();
                this.provider.removeColumnKeys([name]);
            })
        ]);
        this.nameMenuPanel.setOnNameChanged((newName: string, oldName: string,
            callback: (success: boolean) => void) => {
            let exists = this.provider.selectColumnExists(newName);
            if (exists === false) {
                this.provider.renameColumn(oldName, newName);
            } else {
                let message = "Column '" + newName + "' already exists";
                MessageDialog.openError("Column Rename", message, () => {
                    callback(false);
                    this.nameMenuPanel.setShowEdit(true);
                });
            }
        });

        view.css(this.nameMenuPanel, "line-height", GridControlStyle.HEADER_HEIGHT + "px");
        view.setGridData(this.nameMenuPanel, true, true);
    }

    public setLabel(label: DefaultColumnLabel): void {

        let name = label.getLabel();
        this.nameMenuPanel.setName(name);

        let type = label.getType();
        let icon = TypeDecoration.ICON_MAP[type] || TypeDecoration.ICON_MAP.object;
        this.typePanel.setIcon(icon);
        this.composite.relayout();
    }

    public setProperty(name: string, value: any): void {

    }

    public setSelected(selected: boolean): void {
        this.selected = selected;
        view.setSelected(this.composite, this.selected);
    }

    public setOnSelection(callback: (control: Control) => void): void {
        this.onSelection = callback;
    }

    public getControl(): Control {
        return this.composite;
    }

}
