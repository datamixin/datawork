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

import SlemanFactory from "sleman/model/SlemanFactory";

import TextPanel from "padang/view/TextPanel";

import ParameterPlan from "padang/plan/ParameterPlan";

import GuideDialog from "padang/dialogs/guide/GuideDialog";

export default class PointerLiteralPanel implements Panel {

    private dialog: GuideDialog = null
    private plan: ParameterPlan = null;
    private panel = new TextPanel();

    constructor(dialog: GuideDialog, plan: ParameterPlan) {
        this.dialog = dialog;
        this.plan = plan;
    }

    public createControl(parent: Composite): void {
        this.panel.createControl(parent);
        this.update();
        this.panel.setOnModify((text: string) => {
            let factory = SlemanFactory.eINSTANCE;
            let pointer = factory.createXPointer(text);
            this.dialog.setOption(this.plan, pointer);
        });
    }

    private update(): void {
        let pointer = this.dialog.getPointer(this.plan, false);
        let literal = pointer.toLiteral();
        if (literal !== null) {
            this.panel.setText(literal);
        }
    }

    public getValue(): string {
        return this.panel.getText()
    }

    public getControl(): Control {
        return this.panel.getControl();
    }

}