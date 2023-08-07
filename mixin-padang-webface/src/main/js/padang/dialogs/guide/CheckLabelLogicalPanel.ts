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
import XLogical from "sleman/model/XLogical";
import SlemanFactory from "sleman/model/SlemanFactory";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ValueLogicalPanel from "padang/dialogs/guide/ValueLogicalPanel";
import CheckLabelValuePanel from "padang/dialogs/guide/CheckLabelValuePanel";

export default class CheckLabelLogicalPanel extends CheckLabelValuePanel {

    private panel: ValueLogicalPanel = null;
    private logical: XLogical = SlemanFactory.eINSTANCE.createXLogical();

    protected createValueControl(parent: Composite): void {
        this.panel = new ValueLogicalPanel(this.logical);
        this.panel.createControl(parent);
    }

    protected assignValue(): void {
        let logical = this.dialog.getLogical(this.plan, true);
        this.panel.setLogical(logical);
    }

    protected getValueControl(): Control {
        return this.panel.getControl();
    }

    public getValue(): boolean {
        return this.panel.getValue();
    }

}