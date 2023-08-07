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
import Caution from "webface/core/Caution";

import Label from "webface/widgets/Label";
import Button from "webface/widgets/Button";
import Control from "webface/widgets/Control";
import TextArea from "webface/widgets/TextArea";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import SelectionListener from "webface/events/SelectionListener";

export default class CautionPanel {

    private static MESSAGE_HEIGHT = 24;
    private static DETAIL_BUTTON_WIDTH = 120;
    private static SHOW_DETAILS = "Show Details";
    private static HIDE_DETAILS = "Hide Details";

    private composite: Composite = null;
    private messageLabel: Label = null;
    private detailPart: Composite = null;
    private detailButton: Button = null;
    private detailTextArea: TextArea = null;
    private hidden: boolean = true;

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);

        let layout = new GridLayout(1, 10, 10);
        this.composite.setLayout(layout);

        this.createMessageLabel(this.composite);
        this.createDetailPart(this.composite);
    }

    private createMessageLabel(parent: Composite): void {

        this.messageLabel = new Label(parent);

        let layoutData = new GridData(true, CautionPanel.MESSAGE_HEIGHT);
        this.messageLabel.setLayoutData(layoutData);

    }

    public createDetailPart(parent: Composite): void {

        this.detailPart = new Composite(parent);

        let layout = new GridLayout(1, 0, 0);
        this.detailPart.setLayout(layout);

        let layoutData = new GridData(true, true);
        this.detailPart.setLayoutData(layoutData);

        this.createDetailButton(this.detailPart);
        this.createDetailViewer(this.detailPart);
    }


    private createDetailButton(parent: Composite): void {

        this.detailButton = new Button(parent);
        this.detailButton.setText(CautionPanel.SHOW_DETAILS);

        let layoutData = new GridData(CautionPanel.DETAIL_BUTTON_WIDTH);
        this.detailButton.setLayoutData(layoutData);

        this.detailButton.addSelectionListener(<SelectionListener>{
            widgetSelected: () => {
                this.toggleExpanded();
            }
        })
    }

    public toggleExpanded(): void {
        let layoutData = <GridData>this.detailTextArea.getLayoutData();
        if (this.hidden === true) {
            this.detailButton.setText(CautionPanel.HIDE_DETAILS);
            layoutData.applyFillVertical();
        } else {
            this.detailButton.setText(CautionPanel.SHOW_DETAILS);
            layoutData.applyZeroHeight();
        }
        this.hidden = !this.hidden;
        this.detailTextArea.setVisible(!this.hidden);
        this.composite.relayout();
    }

    private createDetailViewer(parent: Composite): void {

        this.detailTextArea = new TextArea(parent);
        this.detailTextArea.setVisible(false);

        let layoutData = new GridData(true, true);
        this.detailTextArea.setLayoutData(layoutData);

    }

    public setCaution(caution: Caution): void {

        let message = caution.getMessage();
        this.setMessage(message);

        let detailMessage = caution.getDetailMessage();
        this.setDetailMessage(detailMessage);

    }

    public setMessage(text: string): void {
        this.messageLabel.setText(text);
    }

    public setDetailMessage(text: string): void {
        let layoutData = <GridData>this.detailPart.getLayoutData();
        if (text === null) {
            layoutData.applyZeroHeight();
        } else {
            layoutData.applyFillVertical();
            this.detailTextArea.setText(text);
        }
    }

    public getControl(): Control {
        return this.composite;
    }
}
