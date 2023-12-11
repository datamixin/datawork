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
import Conductor from "webface/wef/Conductor";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import Composite from "webface/widgets/Composite";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import RunspaceHome from "bekasi/resources/RunspaceHome";
import RunspaceItem from "bekasi/resources/RunspaceItem";
import RunspaceItemList from "bekasi/resources/RunspaceItemList";

import RunspaceFileListPanel from "bekasi/dialogs/RunspaceFileListPanel";
import RunspaceFolderTreePanel from "bekasi/dialogs/RunspaceFolderTreePanel";

import RunspaceHomeListRequest from "bekasi/requests/RunspaceHomeListRequest";
import RunspaceItemListRequest from "bekasi/requests/RunspaceItemListRequest";
import RunspaceItemAncestorsRequest from "bekasi/requests/RunspaceItemAncestorsRequest";

export default class RunspaceFileSelectionDialog extends TitleAreaDialog {

    private static FOLDER_WIDTH = 180;

    private fileName: string = null;
    private fileId: string = null;
    private conductor: Conductor = null;
    private folderTreePanel: RunspaceFolderTreePanel = null;
    private fileListPanel: RunspaceFileListPanel = null;

    constructor(conductor: Conductor) {
        super();
        this.conductor = conductor;
        this.folderTreePanel = new RunspaceFolderTreePanel(conductor);
        this.fileListPanel = new RunspaceFileListPanel();

        this.setDialogSize(540, 420);
        this.setWindowTitle("File Dialog");
        this.setTitle("File Selection");
        this.setMessage("Please select a file");
    }

    protected createControl(parent: Composite): void {

        let composite = new Composite(parent);

        // Layout
        let layout = new GridLayout(2);
        composite.setLayout(layout);

        // Parts
        this.createFolderTreePanel(composite);
        this.createFileListPanel(composite);
    }

    private createFolderTreePanel(parent: Composite): void {

        this.folderTreePanel.createControl(parent);
        let control = this.folderTreePanel.getControl();

        this.folderTreePanel.setHomeCallback(() => {
            this.populateHomeFileList();
        });

        this.folderTreePanel.setFolderCallback((file: RunspaceItem) => {
            let folderId = file.getId();
            this.populateFolderFileList(folderId);
        });

        let layoutData = new GridData(RunspaceFileSelectionDialog.FOLDER_WIDTH, true);
        control.setLayoutData(layoutData);

    }

    private populateHomeFileList(): void {
        let request = new RunspaceHomeListRequest();
        this.conductor.submit(request, (list: RunspaceItemList) => {
            this.populateFileList(list);
        });
    }

    private populateFolderFileList(folderId: string): void {
        let request = new RunspaceItemListRequest(folderId);
        this.conductor.submit(request, (list: RunspaceItemList) => {
            this.populateFileList(list);
        });
    }

    private populateFileList(list: RunspaceItemList): void {
        let files = list.getItems();
        this.fileListPanel.setInput(files);
    }

    private createFileListPanel(parent: Composite): void {

        this.fileListPanel.createControl(parent);
        let control = this.fileListPanel.getControl();

        let layoutData = new GridData(true, true);
        control.setLayoutData(layoutData);

        this.fileListPanel.setDoubleClickCallback((file: RunspaceItem) => {
            if (file.isDirectory()) {
                let itemId = file.getId();
                this.populateFolderFileList(itemId);
                let request = new RunspaceItemAncestorsRequest(itemId);
                this.conductor.submit(request, (items: any[]) => {
                    items[0] = new RunspaceHome();
                    this.folderTreePanel.expandFolder(items);
                })
            }
        });

        this.fileListPanel.setSelectionCallback((file: RunspaceItem) => {
            if (file.isDirectory()) {
                this.fileId = null;
            } else {
                this.fileId = file.getId();
                this.fileName = file.getName();
            }
            this.updatePageComplete();
        });

        // Initial input
        let request = new RunspaceHomeListRequest();
        this.conductor.submit(request, (list: RunspaceItemList) => {
            let files = list.getItems();
            this.fileListPanel.setInput(files);
        });

    }

    private updatePageComplete(): void {

        this.setErrorMessage(null);
        this.okButton.setEnabled(false);

        // Pastikan file id tidak null
        if (this.fileId === null) {
            this.setErrorMessage("Please select a file");
            return;
        }

        this.okButton.setEnabled(true);
    }

    public getFilename(): string {
        return this.fileName;
    }

    public getFileId(): string {
        return this.fileId;
    }

}
