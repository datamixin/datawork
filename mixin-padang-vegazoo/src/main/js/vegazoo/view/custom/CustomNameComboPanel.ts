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

import CustomNameBasePanel from "vegazoo/view/custom/CustomNameBasePanel";

export default class CustomNameComboPanel extends CustomNameBasePanel {

    public static HEIGHT = 24;
    public static NAME_WIDTH = 100;

    private values: string[] = [];
    private valueCombo: Combo = null;

    constructor(name: string, values: string[]) {
        super(name);
        this.values = values;
    }

    protected createValueControl(parent: Composite): void {
        this.valueCombo = new Combo(parent);
        this.valueCombo.setItems(this.values);
    }

    public setValue(value: string): void {
        let index = this.values.indexOf(value);
        this.valueCombo.setSelection(index);
    }

    public onSelection(callback: (value: string) => void): void {
        this.valueCombo.onSelection(() => {
            let selection = this.valueCombo.getSelectionText();
            callback(selection);
        });
    }

    public getValueControl(): Control {
        return this.valueCombo;
    }

}