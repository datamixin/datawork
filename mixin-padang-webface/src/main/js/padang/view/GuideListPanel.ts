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

import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import * as view from "padang/view/view";
import IconLabelPanel from "padang/view/IconLabelPanel";

export default class GuideListPanel implements Panel {

    public static BRIEF_HEIGHT = 24;
    public static ITEM_HEIGHT = 24;

    private composite: Composite = null;
    private container: Composite = null;
    private briefLabel: Label = null;

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent);
        this.composite.setData(this);

        let layout = new GridLayout(1, 0, 0);
        this.composite.setLayout(layout);

        this.createBriefLabel(this.composite);
        this.createContainer(this.composite);
    }

    private createBriefLabel(parent: Composite): void {

        this.briefLabel = new Label(parent);

        let element = this.briefLabel.getElement();
        element.css("line-height", GuideListPanel.BRIEF_HEIGHT + "px");
        element.css("font-style", "italic");
        element.css("color", "#888");

        let layoutData = new GridData(true, GuideListPanel.BRIEF_HEIGHT);
        this.briefLabel.setLayoutData(layoutData);
    }

    private createContainer(parent: Composite): void {

        this.container = new Composite(parent);

        let layout = new GridLayout(1, 0, 0);
        this.container.setLayout(layout);

        let layoutData = new GridData(true, 0);
        this.container.setLayoutData(layoutData);

    }

    public setBrief(brief: string): void {
        this.briefLabel.setText(brief);
    }

    public addItem(icon: string, label: string, callback: () => void): void {

        let panel = new IconLabelPanel();
        panel.createControl(this.container);
        panel.setIcon(icon);
        panel.setLabel(label);
        panel.setOnSelection(callback);

        let layoutData = view.setGridData(panel, true, GuideListPanel.ITEM_HEIGHT);
        layoutData.horizontalIndent = GuideListPanel.ITEM_HEIGHT / 2;
    }

    public adjustHeight(): number {
        let height = view.getGridLayoutHeight(this.composite, [GuideListPanel.BRIEF_HEIGHT]);
        height += view.adjustHeightGridCompositeAdjuster(this.container);
        return height;
    }

    public getControl(): Control {
        return this.composite;
    }

}

