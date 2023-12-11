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
import XNumber from "sleman/model/XNumber";
import SlemanFactory from "sleman/model/SlemanFactory";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ValueNumberPanel from "padang/dialogs/guide/ValueNumberPanel";
import CheckLabelValuePanel from "padang/dialogs/guide/CheckLabelValuePanel";

export default class CheckLabelNumberPanel extends CheckLabelValuePanel {

    private panel: ValueNumberPanel = null;
    private value: XNumber = SlemanFactory.eINSTANCE.createXNumber();

    protected createValueControl(parent: Composite): void {
        this.panel = new ValueNumberPanel(this.value);
        this.panel.createControl(parent);
    }

    protected assignValue(): void {
        let logical = this.dialog.getNumber(this.plan, true);
        this.panel.setNumber(logical);
    }

    public getValue(): number {
        return this.value.getValue();
    }

    protected getValueControl(): Control {
        return this.panel.getControl();
    }

}