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
import Text from "webface/widgets/Text";
import Event from "webface/widgets/Event";
import Label from "webface/widgets/Label";
import Button from "webface/widgets/Button";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import * as webface from "webface/webface";

import Dialog from "webface/dialogs/Dialog";
import DialogButtons from "webface/dialogs/DialogButtons";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import Selection from "webface/viewers/Selection";
import ListViewer from "webface/viewers/ListViewer";
import LabelProvider from "webface/viewers/LabelProvider";
import ContentProvider from "webface/viewers/ContentProvider";
import ListViewerStyle from "webface/viewers/ListViewerStyle";
import StringLabelProvider from "webface/viewers/StringLabelProvider";
import ArrayContentProvider from "webface/viewers/ArrayContentProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import FilteredContentProvider from "webface/viewers/FilteredContentProvider";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import ModifyEvent from "webface/events/ModifyEvent";
import ModifyListener from "webface/events/ModifyListener";

export default class ListSelectionDialog extends Dialog {

    public static ITEM_HEIGHT = 24;

    private prompt: string = null;

    private promptLabel: Label = null;
    private listViewer: ListViewer = null;
    private okButton: Button = null;

    private input: any = null;

    private defaultContentProvider: ContentProvider = new ArrayContentProvider();
    private filteredContentProvider: FilteredContentProvider = null;

    private lavelProvider: LabelProvider = new StringLabelProvider();
    private checked: any[] = null;
    private filtered: boolean = false;
    private doubleClickOK: boolean = false;
    private selection: Selection = new Selection([]);

    constructor() {
        super();
        this.setDialogSize(320, 360);
    }

    public createContents(parent: Composite): void {

        let composite = new Composite(parent);
        let layout = new GridLayout(1, 10, 10, 0, 0);
        composite.setLayout(layout);

        this.createPromptLabel(composite);
        this.createViewerPart(composite);

        this.setDefaultButton(this.okButton);

    }

    private createPromptLabel(parent: Composite): void {

        // Label
        this.promptLabel = new Label(parent);
        this.promptLabel.setText(this.prompt === null ? "Please select elements:" : this.prompt);

        // Layout data
        let layoutData = new GridData(true, ListSelectionDialog.ITEM_HEIGHT);
        this.promptLabel.setLayoutData(layoutData);
    }

    private createViewerPart(parent: Composite): void {

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

        let layout = new GridLayout(2, 0, 0, 0, 0);
        composite.setLayout(layout);

        // Layout data
        let layoutData = new GridData(true, ListSelectionDialog.ITEM_HEIGHT + 2);
        composite.setLayoutData(layoutData);

        this.createFilterIcon(composite);
        this.createFilterText(composite);
    }

    private createFilterIcon(parent: Composite): void {

        let icon = new WebFontIcon(parent);
        icon.addClasses("mdi", "mdi-magnify");
        let size = ListSelectionDialog.ITEM_HEIGHT;

        let element = icon.getElement();
        element.css("font-size", "18px");
        element.css("text-align", "center");
        element.css("background-color", "#F8F8F8");
        element.css("border-top-left-radius", "4px");
        element.css("border-bottom-left-radius", "4px");
        element.css("border", "1px solid #E8E8E8");

        // Layout data
        let layoutData = new GridData(size, true);
        icon.setLayoutData(layoutData);
    }

    private createFilterText(parent: Composite): void {

        let text = new Text(parent);
        let element = text.getElement();
        element.css("border", "1px solid #E8E8E8");
        element.css("border-left", "0");
        element.css("border-top-left-radius", "0");
        element.css("border-bottom-left-radius", "0");

        // Layout data
        let layoutData = new GridData(true, true);
        text.setLayoutData(layoutData);

        text.addModifyListener(<ModifyListener>{
            modifyText: (event: ModifyEvent) => {
                let word = text.getText();
                if (word.length > 0) {
                    this.filteredContentProvider.setFilter(word);
                } else {
                    this.filteredContentProvider.setFilter(null);
                }
                this.selection = new Selection([]);
                this.listViewer.setInput(this.input);
                this.updatePageComplete();
            }
        });

        text.forceFocus();
    }

    private createListViewer(parent: Composite): void {

        let style = new ListViewerStyle();
        this.listViewer = new ListViewer(parent, style);

        // Element
        let element = this.listViewer.getElement();
        element.css("border", "1px solid #DEDEDE");

        // Layout data
        let layoutData = new GridData(true, true);
        this.listViewer.setLayoutData(layoutData);

        if (this.filtered === true) {
            this.filteredContentProvider = new FilteredContentProvider(this.defaultContentProvider, this.lavelProvider);
            this.listViewer.setContentProvider(this.filteredContentProvider);
        } else {
            this.listViewer.setContentProvider(this.defaultContentProvider);
        }

        this.listViewer.setLabelProvider(this.lavelProvider);
        this.listViewer.setInput(this.input);
        if (this.checked !== null) {
            this.listViewer.setChecked(this.checked);
        } else {
            this.listViewer.setSelection(this.selection);
        }

        // Listener
        this.listViewer.addSelectionChangedListener(<SelectionChangedListener>{
            selectionChanged: (event: SelectionChangedEvent) => {
                this.selection = event.getSelection();
                this.updatePageComplete();
            }
        });

        this.listViewer.addListener(webface.MouseDoubleClick, <Listener>{

            handleEvent: (event: Event) => {
                if (this.doubleClickOK === true) {
                    this.defaultEnter();
                }
            }
        });
    }


    protected updatePageComplete(): void {
        this.okButton.setEnabled(false);
        if (!this.selection.isEmpty()) {
            this.okButton.setEnabled(true);
        }
    }

    public createButtons(buttons: DialogButtons): void {
        buttons.createCancelButton();
        this.okButton = buttons.createOKButton();
        this.okButton.setEnabled(false);
    }

    public setPrompt(prompt: string): void {
        this.prompt = prompt;
        if (this.promptLabel !== null) {
            this.promptLabel.setText(prompt);
        }
    }

    public setContentProvider(provider: ContentProvider): void {
        this.defaultContentProvider = provider;
    }

    public setLabelProvider(provider: LabelProvider): void {
        this.lavelProvider = provider;
    }

    public setInput(input: any): void {
        this.input = input;
    }

    public setChecked(checked: any[]): void {
        this.checked = checked;
    }

    public setFiltered(filtered: boolean): void {
        this.filtered = filtered;
    }

    public setDoubleClickOK(doubleClickOK: boolean): void {
        this.doubleClickOK = doubleClickOK;
    }

    public setSelection(selection: Selection): void {
        this.selection = selection;
    }

    public getSelection(): Selection {
        return this.selection;
    }

    public getFirstSelection(): any {
        return this.selection.getFirstElement();
    }

}

