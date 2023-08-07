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
import * as functions from "webface/functions";

import Text from "webface/widgets/Text";
import Label from "webface/widgets/Label";
import Button from "webface/widgets/Button";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import ListViewer from "webface/viewers/ListViewer";
import ContentProvider from "webface/viewers/ContentProvider";
import ListViewerStyle from "webface/viewers/ListViewerStyle";
import LabelProvider from "webface/viewers/LabelProvider";
import StringLabelProvider from "webface/viewers/StringLabelProvider";
import ArrayContentProvider from "webface/viewers/ArrayContentProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import FilteredContentProvider from "webface/viewers/FilteredContentProvider";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import ModifyEvent from "webface/events/ModifyEvent";
import SelectionEvent from "webface/events/SelectionEvent";
import ModifyListener from "webface/events/ModifyListener";
import SelectionListener from "webface/events/SelectionListener";

import FlexiblePopup from "webface/popup/FlexiblePopup";

export default class ListSelectionPopup extends FlexiblePopup {

    public static WIDTH = 240;
    public static HEIGHT = 360;
    public static ICON_SIZE = 22;
    public static LABEL_HEIGHT = 22;
    public static BUTTON_HEIGHT = 32;
    public static BUTTON_WIDTH = 72;

    private input: any = null;

    private checked: any[] = [];

    private filtered: boolean = false;

    private contentProvider: ContentProvider = new ArrayContentProvider();
    private filteredContentProvider: FilteredContentProvider = null;

    private lavelProvider: LabelProvider = new StringLabelProvider();

    private prompt: Label;
    private viewer: ListViewer;
    private infoChecked: Label;

    public createControl(parent: Composite) {

        let composite = new Composite(parent);

        let layout = new GridLayout(1, 10, 10);
        composite.setLayout(layout);

        this.createPrompt(composite);
        this.createViewer(composite);
        this.createMessage(composite);
        this.createButtons(composite);
    }

    private createPrompt(parent: Composite): void {

        // Label
        this.prompt = new Label(parent);
        this.prompt.setText("Please select elements:");

        // Layout data
        let layoutData = new GridData();
        layoutData.heightHint = ListSelectionPopup.LABEL_HEIGHT;
        layoutData.grabExcessHorizontalSpace = true;
        this.prompt.setLayoutData(layoutData);

    }

    private createViewer(parent: Composite): void {

        let composite = new Composite(parent);

        let layout = new GridLayout(1, 0, 0);
        composite.setLayout(layout);

        // Layout data
        let layoutData = new GridData(true, true);
        composite.setLayoutData(layoutData);

        if (this.filtered === true) {
            this.createListFilter(composite);
        }

        this.createListViewer(composite);
    }

    private createListFilter(parent: Composite): void {

        let composite = new Composite(parent);

        let element = composite.getElement();
        element.css("border", "1px solid #D8D8D8");
        element.css("border-radius", "4px");

        let layout = new GridLayout(2, 0, 0, 0);
        composite.setLayout(layout);

        // Layout data
        let layoutData = new GridData(true, ListSelectionPopup.LABEL_HEIGHT);
        composite.setLayoutData(layoutData);

        this.createFilterIcon(composite);
        this.createFilterText(composite);
    }

    private createFilterIcon(parent: Composite): void {

        let label = new Label(parent);

        let element = label.getElement();
        element.addClass("mdi");
        element.addClass("mdi-magnify");
        element.css("font-size", "18px");
        element.css("line-height", "22px");
        element.css("text-align", "center");
        element.css("background-color", "#F8F8F8");
        element.css("border-top-left-radius", "4px");
        element.css("border-bottom-left-radius", "4px");
        element.css("border-right", "1px solid #E8E8E8");

        // Layout data
        let layoutData = new GridData(ListSelectionPopup.ICON_SIZE, ListSelectionPopup.ICON_SIZE);
        label.setLayoutData(layoutData);
    }

    private createFilterText(parent: Composite): void {

        let text = new Text(parent);

        let element = text.getElement();
        element.css("border", "0");

        // Layout data
        let layoutData = new GridData(true, ListSelectionPopup.ICON_SIZE);
        text.setLayoutData(layoutData);

        text.addModifyListener(<ModifyListener>{
            modifyText: (event: ModifyEvent) => {
                let word = text.getText();
                if (word.length > 0) {
                    this.filteredContentProvider.setFilter(word);
                } else {
                    this.filteredContentProvider.setFilter(null);
                }
                this.viewer.setInput(this.input);
                this.viewer.setChecked(this.checked);
            }
        });

        text.forceFocus();
    }

    private createListViewer(parent: Composite): void {

        let style = new ListViewerStyle();
        style.mark = ListViewerStyle.CHECK;
        this.viewer = new ListViewer(parent, style);

        // Element
        let element = this.viewer.getElement();
        element.css("border", "1px solid #DEDEDE");

        // Layout data
        let layoutData = new GridData(true, true);
        this.viewer.setLayoutData(layoutData);

        if (this.filtered === true) {
            if (functions.isNullOrUndefined(this.filteredContentProvider)) {
                this.filteredContentProvider = new FilteredContentProvider(this.contentProvider, this.lavelProvider);
            }
            this.viewer.setContentProvider(this.filteredContentProvider);
        } else {
            this.viewer.setContentProvider(this.contentProvider);
        }

        this.viewer.setLabelProvider(this.lavelProvider);
        this.viewer.setInput(this.input);
        this.viewer.setChecked(this.checked);

        this.viewer.addSelectionChangedListener(<SelectionChangedListener>{
            selectionChanged: (event: SelectionChangedEvent) => {
                let checked = this.viewer.getChecked();
                this.checked = checked;
                this.infoChecked.setText(this.checked.length + " elements selected");
            }
        });
    }

    private createMessage(parent: Composite): void {

        this.infoChecked = new Label(parent);

        // Layout data
        let layoutData = new GridData(true, ListSelectionPopup.LABEL_HEIGHT);
        this.infoChecked.setLayoutData(layoutData);

        let checked = this.viewer.getChecked();
        this.infoChecked.setText(checked.length + " elements selected");
    }

    private createButtons(parent: Composite): void {

        let composite = new Composite(parent);

        // Layout
        let layout = new GridLayout(3, 5, 0, 10, 5);
        composite.setLayout(layout);

        // Layout data
        let layoutData = new GridData(true, ListSelectionPopup.BUTTON_HEIGHT);
        composite.setLayoutData(layoutData);


        // Create buttons
        this.createSpaceLabel(composite);
        this.createCancelButton(composite);
        this.createOKButton(composite);
    }

    private createSpaceLabel(parent: Composite): void {

        // Blank space
        let label = new Label(parent);

        let layoutData = new GridData(true, true);
        label.setLayoutData(layoutData);
    }

    private createCancelButton(parent: Composite): void {

        // Cancel buttons
        let button = new Button(parent);
        button.setText("Cancel");

        // Layout data
        let layoutData = new GridData(ListSelectionPopup.BUTTON_WIDTH, true);
        button.setLayoutData(layoutData);

        // Click
        button.addSelectionListener(<SelectionListener>{
            widgetSelected: (event: SelectionEvent) => {
                this.close();
            }
        });
    }

    private createOKButton(parent: Composite): void {

        // OK Button
        let button = new Button(parent);
        button.setText("OK");

        // Layout data
        let layoutData = new GridData(ListSelectionPopup.BUTTON_WIDTH, true);
        button.setLayoutData(layoutData);

        // Click
        button.addSelectionListener(<SelectionListener>{
            widgetSelected: (event: SelectionEvent) => {
                let checked = this.viewer.getChecked();
                this.close(checked);
            }
        });
    }

    public getWidth(): number {
        return ListSelectionPopup.WIDTH;
    }

    public getHeight(): number {
        return ListSelectionPopup.HEIGHT;
    }

    public setPrompt(prompt: string): void {
        this.prompt.setText(prompt);
    }

    public setFilteredContentProvider(provider: FilteredContentProvider): void {
        this.filteredContentProvider = provider;
    }

    public setContentProvider(provider: ContentProvider): void {
        this.contentProvider = provider;
    }

    public setLabelProvider(provider: LabelProvider): void {
        this.lavelProvider = provider;
    }

    public setChecked(checked: any[]): void {
        this.checked = checked;
    }

    public setFiltered(filtered: boolean): void {
        this.filtered = filtered;
    }

    public setInput(input: any): void {
        this.input = input;
    }

}
