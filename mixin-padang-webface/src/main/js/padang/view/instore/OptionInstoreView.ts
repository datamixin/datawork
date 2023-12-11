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

import ConductorView from "webface/wef/ConductorView";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";
import FormulaPanel from "padang/view/FormulaPanel";

export default class OptionInstoreView extends ConductorView {

    private static HEIGHT = 30;

    private static LABEL_WIDTH = 120;
    private static FORMULA_WIDTH = 480;

    private composite: Composite = null;
    private labelPanel = new LabelPanel();
    private literalPanel: FormulaPanel = null;
    private descriptionPanel = new LabelPanel();

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);

        let element = this.composite.getElement();
        element.addClass("padang-option-instore-view");

        view.setGridLayout(this.composite, 3, 0, 0);
        this.createNamePanel(this.composite);
        this.createLiteralPanel(this.composite);
        this.createDescriptionPanel(this.composite);

    }

    private createNamePanel(parent: Composite): void {
        this.labelPanel.createControl(parent);
        view.setGridData(this.labelPanel, OptionInstoreView.LABEL_WIDTH, true);
    }

    private createLiteralPanel(parent: Composite): void {
        this.literalPanel = new FormulaPanel(this.conductor);
        this.literalPanel.createControl(parent);
        view.setGridData(this.literalPanel, OptionInstoreView.FORMULA_WIDTH, true);
    }

    private createDescriptionPanel(parent: Composite): void {
        this.descriptionPanel.createControl(parent);
        view.css(this.descriptionPanel, "color", "#888");
        view.css(this.descriptionPanel, "font-style", "italic");
        view.setGridData(this.descriptionPanel, true, true);
    }

    public setLabel(label: string): void {
        this.labelPanel.setText(label);
    }

    public setType(type: string): void {
        this.literalPanel.setType(type);
    }

    public setFormula(formula: string): void {
        this.literalPanel.setFormula(formula);
    }

    public setAssignable(assignable: string): void {
        this.literalPanel.setAssignable(assignable);
    }

    public setDescription(description: string): void {
        this.descriptionPanel.setText(description);
    }

    public adjustHeight(): number {
        return OptionInstoreView.HEIGHT;
    }

    public getControl(): Control {
        return this.composite;
    }

}
