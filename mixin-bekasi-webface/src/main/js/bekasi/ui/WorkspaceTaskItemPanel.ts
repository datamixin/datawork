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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import TaskKey from "bekasi/ui/TaskKey";
import TaskItem from "bekasi/ui/TaskItem";

export default class WorkspaceTaskItemPanel {

    public static HEIGHT = 32;

    private static ICON_WIDTH = 24;

    private item: TaskItem = null;
    private composite: Composite = null;
    private taskIcon: WebFontIcon = null;
    private taskLabel: Label = null;
    private closeIcon: WebFontIcon = null;
    private selectCallback = () => { };
    private closeCallback = () => { };

    constructor(item: TaskItem) {
        this.item = item;
    }

    public getItem(): TaskItem {
        return this.item;
    }

    public createControl(parent: Composite): void {

        this.composite = new Composite(parent);

        let element = this.composite.getElement();
        element.addClass("bekasi-workspace-task-item-panel");

        let layout = new GridLayout(3, 5, 0);
        this.composite.setLayout(layout);

        this.createTaskIcon(this.composite);
        this.createTaskLabel(this.composite);
        this.createCloseIcon(this.composite);

        this.composite.onSelection(() => {
            this.selectCallback();
        });

    }

    private createTaskIcon(parent: Composite): void {

        this.taskIcon = new WebFontIcon(parent);
        this.taskIcon.addClass("mdi");

        let element = this.taskIcon.getElement();
        element.addClass("bekasi-workspace-task-item-icon");
        element.css("line-height", WorkspaceTaskItemPanel.HEIGHT + "px");
        element.css("font-size", "24px");

        let layoutData = new GridData(0, true);
        this.taskIcon.setLayoutData(layoutData);

        let image = this.item.getImage();
        if (image !== null) {
            this.setImage(image);
        }

    }

    private createTaskLabel(parent: Composite): void {

        this.taskLabel = new Label(parent);

        let element = this.taskLabel.getElement();
        element.css("line-height", WorkspaceTaskItemPanel.HEIGHT + "px");
        element.css("text-overflow", "ellipsis");

        let layoutData = new GridData(true, true);
        this.taskLabel.setLayoutData(layoutData);

        this.updateText();
    }

    private updateText(): void {

        let text = this.item.getText();
        this.setText(text);

        let element = this.taskLabel.getElement();
        element.attr("title", text);

    }

    private createCloseIcon(parent: Composite): void {

        this.closeIcon = new WebFontIcon(parent);
        this.closeIcon.addClasses("mdi", "mdi-close");
        this.closeIcon.setVisible(false);

        let element = this.closeIcon.getElement();
        element.css("line-height", WorkspaceTaskItemPanel.HEIGHT + "px");
        element.css("font-size", "18px");

        let layoutData = new GridData(0, true);
        this.closeIcon.setLayoutData(layoutData);

        this.closeIcon.onSelection(() => {
            this.item.close((confirm: boolean) => {
                if (confirm === true) {
                    this.remove();
                    this.closeCallback();
                }
            });
        });

        let closeable = this.item.isCloseable();
        if (closeable !== undefined) {
            this.setCloseable(closeable);
        }

    }

    public setImage(icon: string): void {

        this.taskIcon.addClass(icon);
        let layoutData = <GridData>this.taskIcon.getLayoutData();
        layoutData.widthHint = 30;

        this.composite.relayout();
    }

    public setText(text: string): void {
        this.taskLabel.setText(text);
    }

    public isMatch(taskKey: TaskKey): boolean {
        let content = this.item.getContent();
        let contentKey = content.getTaskKey();
        let taskKeyId = taskKey.getIdentity();
        let contentKeyId = contentKey.getIdentity();
        return taskKeyId === contentKeyId;
    }

    public setCloseable(closeable: boolean): void {

        if (closeable === true) {

            let layoutData = <GridData>this.closeIcon.getLayoutData();
            layoutData.widthHint = WorkspaceTaskItemPanel.ICON_WIDTH;

            this.composite.relayout();
        }
    }

    public setSelectCallback(callback: () => void): void {
        this.selectCallback = callback;
    }

    public setCloseCallback(callback: () => void): void {
        this.closeCallback = callback;
    }

    public setSelected(selected: boolean): void {

        // Tambah atau hapus style class selected
        let element = this.composite.getElement();
        if (selected === true) {
            element.addClass("selected");
        } else {
            element.removeClass("selected");
        }

        // Tampilkan close icon jika closeable
        let layoutData = <GridData>this.closeIcon.getLayoutData();
        if (layoutData.widthHint !== 0) {
            this.closeIcon.setVisible(selected);
        }
    }

    public remove(): void {

        // Close content first
        let content = this.item.getContent();
        content.close();

        // Dispose this panel
        this.composite.dispose();

    }

    public refresh(): void {
        this.updateText();
    }

    public getControl(): Control {
        return this.composite;
    }

}