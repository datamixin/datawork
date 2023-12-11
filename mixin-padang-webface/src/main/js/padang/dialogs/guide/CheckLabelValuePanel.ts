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
import Panel from "webface/wef/Panel";

import Check from "webface/widgets/Check";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConstantPlan from "webface/plan/ConstantPlan";

import { expressionFactory } from "sleman/ExpressionFactory";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import ParameterPlan from "padang/plan/ParameterPlan";

import GuideDialog from "padang/dialogs/guide/GuideDialog";

export abstract class CheckLabelValuePanel implements Panel {

    protected dialog: GuideDialog = null;
    protected label: string = null;
    protected plan: ParameterPlan = null;

    private composite: Composite = null;
    private check: Check = null;

    constructor(dialog: GuideDialog, label: string, plan: ParameterPlan) {
        this.dialog = dialog;
        this.label = label;
        this.plan = plan;
    }

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        widgets.setGridLayout(this.composite, 3, 0, 0, 0, 0);

        this.createCheckPart(this.composite);
        this.createLabelPart(this.composite);
        this.createPanelPart(this.composite);
    }

    private createCheckPart(parent: Composite): void {
        this.check = dialogs.createCheckGridSpace(this.composite);
        this.check.onSelection((checked: boolean) => {
			let name = this.plan.getName();
            if (checked === true) {
                let assignedPlan = this.plan.getAssignedPlan();
                if (assignedPlan instanceof ConstantPlan) {
                    let defaultValue = assignedPlan.getDefaultValue();
                    let expression = expressionFactory.createValue(defaultValue);
                    this.dialog.setOption(name, expression);
                    this.assignValue();
                } else {
                    this.dialog.setOption(name, null);
                }
            } else {
                this.dialog.deleteOption(name);
            }
            let control = this.getValueControl();
            dialogs.setEnabled(control, checked);
            this.dialog.updatePageComplete();
        });
    }

    private createLabelPart(parent: Composite): void {
        let width = dialogs.LABEL_WIDTH - dialogs.ICON_SIZE;
        dialogs.createLabelGridWidth(this.composite, this.label, width);
    }

    private createPanelPart(parent: Composite): void {

        this.createValueControl(parent);
        let control = this.getValueControl();
        widgets.setGridData(control, true, true);

        let name = this.plan.getName();
        if (this.dialog.hasOption(name)) {
            this.check.setChecked(true);
            this.assignValue();
        } else {
            this.check.setChecked(false);
        }
    }

    protected abstract createValueControl(parent: Composite): void;

    protected abstract getValueControl(): Control;

    protected abstract assignValue(): void;

    public abstract getValue(): any;

    public isChecked(): boolean {
        return this.check.isChecked();
    }

    public getControl(): Control {
        return this.composite;
    }

}

export default CheckLabelValuePanel;