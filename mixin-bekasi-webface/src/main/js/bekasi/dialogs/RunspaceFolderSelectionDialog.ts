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
import Conductor from "webface/wef/Conductor";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import Composite from "webface/widgets/Composite";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import RunspaceHome from "bekasi/resources/RunspaceHome";
import RunspaceItem from "bekasi/resources/RunspaceItem";

import RunspaceFolderTreePanel from "bekasi/dialogs/RunspaceFolderTreePanel";

export default class RunspaceFolderSelectionDialog extends TitleAreaDialog {

    private folderId: string = null;
    private folderTreePanel: RunspaceFolderTreePanel = null;

    constructor(conductor: Conductor) {
        super();
        this.folderTreePanel = new RunspaceFolderTreePanel(conductor);

        this.setDialogSize(320, 420);
        this.setWindowTitle("Folder Dialog");
        this.setTitle("Folder Selection");
        this.setMessage("Please select a folder");
    }

    protected createControl(parent: Composite): void {

        let composite = new Composite(parent);

        // Layout
        let layout = new GridLayout(1);
        composite.setLayout(layout);

        // Parts
        this.createFolderTreePanel(composite);

        this.okButton.setEnabled(true);

    }

    private createFolderTreePanel(parent: Composite): void {

        this.folderTreePanel.createControl(parent);

        this.folderTreePanel.setHomeCallback((home: RunspaceHome) => {
            this.folderId = home.getId();
        });

        this.folderTreePanel.setFolderCallback((file: RunspaceItem) => {
            this.folderId = file.getId();
        });

        let control = this.folderTreePanel.getControl();
        let layoutData = new GridData(true, true);
        control.setLayoutData(layoutData);

        this.folderTreePanel.expandFolder([new RunspaceHome()]);
    }

    public getFolder(): string {
        return this.folderId;
    }

}
