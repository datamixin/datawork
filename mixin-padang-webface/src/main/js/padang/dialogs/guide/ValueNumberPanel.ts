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
import Panel from "webface/wef/Panel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import XNumber from "sleman/model/XNumber";

import TextPanel from "padang/view/TextPanel";

export default class ValueTextPanel implements Panel {

    private value: XNumber = null;
    private panel = new TextPanel();

    constructor(value: XNumber) {
        this.value = value;
    }

    public createControl(parent: Composite, index?: number): void {
        this.panel.createControl(parent);
        this.update();
        this.panel.setOnModify((text: string) => {
            this.value.setValue(parseInt(text));
        });
    }

    public setNumber(value: XNumber): void {
        this.value = value;
        this.update();
    }

    private update(): void {
        let value = this.value.getValue();
        if (value !== null) {
            let literal = this.value.getValue();
            this.panel.setText(<any>literal);
        }
    }

    public getValue(): number {
        return this.value.getValue();
    }

    public getControl(): Control {
        return this.panel.getControl();
    }

}