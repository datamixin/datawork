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

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import TreeViewer from "webface/viewers/TreeViewer";
import LabelProvider from "webface/viewers/LabelProvider";
import TreeContentProvider from "webface/viewers/TreeContentProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import WebFontImage from "webface/graphics/WebFontImage";

import * as bekasi from "bekasi/bekasi";

import RunspaceHome from "bekasi/resources/RunspaceHome";
import RunspaceItem from "bekasi/resources/RunspaceItem";
import RunspaceItemList from "bekasi/resources/RunspaceItemList";

import RunspaceHomeListRequest from "bekasi/requests/RunspaceHomeListRequest";
import RunspaceItemListRequest from "bekasi/requests/RunspaceItemListRequest";

export default class RunspaceFolderTreePanel {

    private home = new RunspaceHome();
    private conductor: Conductor = null;
    private folderViewer: TreeViewer = null;
    private homeCallback = (home: RunspaceHome) => { };
    private folderCallback = (file: RunspaceItem): void => { };

    constructor(conductor: Conductor) {
        this.conductor = conductor;
    }

    public createControl(parent: Composite): void {

        this.folderViewer = new TreeViewer(parent);
        this.folderViewer.setLabelProvider(new FolderLabelProvider());
        this.folderViewer.setContentProvider(new FolderContentProvider(this.conductor));

        this.folderViewer.setInput(this.home);

        let element = this.folderViewer.getElement();
        element.css("border", "1px solid #D8D8D8");

        this.folderViewer.addSelectionChangedListener(<SelectionChangedListener>{
            selectionChanged: (event: SelectionChangedEvent) => {

                let selection = event.getSelection();
                if (selection.isEmpty() === false) {
                    let element = selection.getFirstElement();
                    if (element instanceof RunspaceHome) {
                        this.homeCallback(this.home);
                    } else {
                        let file = <RunspaceItem>element;
                        this.folderCallback(file);
                    }

                }
            }
        });

        let request = new RunspaceHomeListRequest();
        this.conductor.submit(request, (list: RunspaceItemList) => {
            let id = list.getId();
            this.home.setId(id);
            this.homeCallback(this.home);
        });

    }

    public setHomeCallback(callback: (home: RunspaceHome) => void): void {
        this.homeCallback = callback;
    }

    public setFolderCallback(callback: (file: RunspaceItem) => void): void {
        this.folderCallback = callback;
    }

    public expandFolder(path: any[]): void {
        this.folderViewer.expandItems(path);
    }

    public getControl(): Control {
        return this.folderViewer;
    }

}

class FolderLabelProvider implements LabelProvider {

    public getText(element: any): string {
        if (element instanceof RunspaceHome) {
            return bekasi.ROOT;
        } else {
            let file = <RunspaceItem>element;
            return file.getName();
        }
    }

    public getImage(element: any): WebFontImage {
        if (element instanceof RunspaceHome) {
            return new WebFontImage("mdi", "mdi-home");
        } else if (element instanceof RunspaceItem) {
            return new WebFontImage("mdi", "mdi-folder");
        }
        return null;
    }

    public getImageColor(element: any): string {
        if (element instanceof RunspaceItem) {
            return "#ffc774";
        } else if (element instanceof RunspaceItem) {
            return "#ffc774";
        }
        return null;
    }

}

class FolderContentProvider implements TreeContentProvider {

    private conductor: Conductor;

    constructor(conductor: Conductor) {
        this.conductor = conductor;
    }

    public getElements(home: RunspaceHome, callback: (list: any[]) => void): void {
        callback([home]);
    }

    public getChildren(element: any, callback: (files: RunspaceItem[]) => void): void {
        if (element instanceof RunspaceHome) {
            let request = new RunspaceHomeListRequest();
            this.conductor.submit(request, (list: RunspaceItemList) => {
                let files = this.getFolderList(list);
                callback(files);
            });
        } else if (element instanceof RunspaceItem) {
            let folderId = element.getId();
            let request = new RunspaceItemListRequest(folderId);
            this.conductor.submit(request, (list: RunspaceItemList) => {
                let files = this.getFolderList(list);
                callback(files);
            });
        }
    }

    private getFolderList(list: RunspaceItemList): RunspaceItem[] {
        let folders: RunspaceItem[] = [];
        let files = list.getItems();
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (file.isDirectory()) {
                folders.push(file);
            }
        }
        return folders;
    }

    public hasChildren(element: any, callback: (state: boolean) => void): void {
        if (element instanceof RunspaceHome) {
            callback(true);
        } else if (element instanceof RunspaceItem) {
            let itemCount = element.getItemCount();
            callback(itemCount > 0);
        }
    }

    public isEquals(element: any, other: any): boolean {
        if (element instanceof RunspaceHome && other instanceof RunspaceHome) {
            let itemName = element.getName();
            let otherName = other.getName();
            return itemName === otherName;
        } else if (element instanceof RunspaceItem && other instanceof RunspaceItem) {
            let itemId = element.getId();
            let otherId = other.getId();
            return itemId === otherId;
        } else {
            return element === other;
        }
    }

}