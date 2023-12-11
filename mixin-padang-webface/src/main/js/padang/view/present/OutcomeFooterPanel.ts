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

import ConductorPanel from "webface/wef/ConductorPanel";

import VisageError from "bekasi/visage/VisageError";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

export default class OutcomeFooterPanel extends ConductorPanel {

    private composite: Composite = null;
    private errorPanel = new LabelPanel();
    private briefPanel = new LabelPanel();

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);

        let element = this.composite.getElement();
        element.addClass("padang-outcome-footer-panel");
        element.css("background-color", "#F8F8F8");

        view.setGridLayout(this.composite, 1, 10, 0, 0, 0);

        this.createErrorPanel(this.composite);
        this.createBriefPanel(this.composite);

    }

    private createErrorPanel(parent: Composite): void {
        this.errorPanel.createControl(parent);
        view.css(this.errorPanel, "color", "#c5221f")
        view.setGridData(this.errorPanel, true, true);
    }

    private createBriefPanel(parent: Composite): void {
        this.briefPanel.createControl(parent);
        view.setGridData(this.briefPanel, true, true);
        view.grabVerticalExclusive(this.briefPanel);
    }

    public setText(text: string): void {
        view.grabVerticalExclusive(this.briefPanel);
        this.briefPanel.setText(text);
    }

    public setError(error: VisageError): void {
        view.grabVerticalExclusive(this.errorPanel);
        let message = error.getMessage();
        this.errorPanel.setText(message);
    }

    public getControl(): Control {
        return this.composite;
    }

}