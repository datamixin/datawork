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

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import ParameterPlan from "padang/plan/ParameterPlan";

import GuideDialog from "padang/dialogs/guide/GuideDialog";
import FormulaEditorPanel from "padang/dialogs/guide/FormulaEditorPanel";

export default class LabelFormulaEditorPanel implements Panel {

    private label: string = null;
    private composite: Composite = null;
    private panel: FormulaEditorPanel = null;

    constructor(label: string, dialog: GuideDialog, plan: ParameterPlan) {
        this.label = label;
        this.panel = new FormulaEditorPanel(dialog, plan);
    }

    public createControl(parent: Composite, index?: number): void {
        this.composite = new Composite(parent, index);
        widgets.setGridLayout(this.composite, 2, 0, 0, 0, 0);
        dialogs.createLabelGridLabel(this.composite, this.label);
        this.createPanelPart(this.composite);
    }

    private createPanelPart(parent: Composite): void {
        this.panel.createControl(parent);
        widgets.setGridData(this.panel, true, true);
    }

    public getValue(): string {
        return this.panel.getValue()
    }

    public getControl(): Control {
        return this.composite;
    }

}