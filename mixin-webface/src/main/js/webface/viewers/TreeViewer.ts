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
import * as webface from "webface/webface";
import * as functions from "webface/functions";

import Viewer from "webface/viewers/Viewer";
import LabelProvider from "webface/viewers/LabelProvider";

import Scrolled from "webface/widgets/Scrolled";
import Composite from "webface/widgets/Composite";
import ScrollManager from "webface/widgets/ScrollManager";
import ScrolledContent from "webface/widgets/ScrolledContent";
import TreeContentProvider from "webface/viewers/TreeContentProvider";

import * as widgets from "webface/widgets/functions";

export interface TreeContainer {

    append(element: JQuery): void

    updateSize(): void;

    getLabelProvider(): LabelProvider;

    getContentProvider(): TreeContentProvider;

    notifySelectionChangedListener(items: TreeItem[]): void;

}

export abstract class BaseTreeContainer implements TreeContainer {

    protected parent: TreeContainer;
    protected element: JQuery;

    constructor(element: JQuery, parent: TreeContainer) {
        this.element = element;
        this.parent = parent;
        this.parent.append(element);
    }

    public append(element: JQuery): void {
        this.element.append(element);
    }

    public updateSize(): void {
        this.adjustWidth();
        this.adjustHeight();
        this.parent.updateSize();
    }

    abstract adjustHeight(): number;

    abstract adjustWidth(): number;

    public notifySelectionChangedListener(items: TreeItem[]): void {
        this.parent.notifySelectionChangedListener(items);
    }

    public getLabelProvider(): LabelProvider {
        return this.parent.getLabelProvider();
    }

    public getContentProvider(): TreeContentProvider {
        return this.parent.getContentProvider();
    }

}

export class TreeItemsContainer extends BaseTreeContainer {

    protected items: TreeItem[] = [];

    constructor(element: JQuery, parent: TreeContainer) {
        super(element, parent);
    }

    public adjustHeight(): number {
        let height = 0;
        for (var i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            height += item.adjustHeight();
        }
        return height;
    }

    public adjustWidth(): number {
        let width = 0;
        for (var i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let itemWidth = item.adjustWidth();
            width = Math.max(width, itemWidth);
        }
        return width;
    }

    public getTreeItems(): TreeItem[] {
        return this.items;
    }

    public notifySelectionChangedListener(items: TreeItem[]): void {
        this.parent.notifySelectionChangedListener(items);
    }
}

export default class TreeViewer extends Viewer implements Scrolled, TreeContainer {

    public static ITEM_HEIGHT: number = 24;   // Tinggi item yang sama untuk semua-nya.

    private content: TreeContent;
    private scrollManager: ScrollManager;
    private labelProvider: LabelProvider;
    private contentProvider: TreeContentProvider;
    private selectedItems: TreeItem[] = [];
    private input: any = null;

    constructor(parent: Composite, index?: number) {
        super(jQuery("<div>"), parent, index);

        this.element.addClass("scrollable");
        this.element.addClass("viewers-treeViewer");
        this.element.css({
            "overflow": "hidden"
        });

        this.scrollManager = new ScrollManager(this);
        this.content = new TreeContent(this, this);

    }

    public append(element: JQuery): void {
        let viewPort = this.scrollManager.getViewPort();
        let viewPortElement = viewPort.getElement();
        viewPortElement.append(element);
    }

    public updateSize(): void {
        this.scrollManager.layout();
    }

    public adjustHeight(): number {
        return webface.DEFAULT;
    }

    public adjustWidth(): number {
        return webface.DEFAULT;
    }

    public setSize(width: number, height: number): void {
        super.setSize(width, height);
        this.scrollManager.layout();
    }

    public getScrolledElement(): JQuery {
        return this.element;
    }

    public getScrolledContent(): ScrolledContent {
        return this.content;
    }

    public setLabelProvider(labelProvider: LabelProvider): void {
        this.labelProvider = labelProvider;
    }

    public getLabelProvider(): LabelProvider {
        return this.labelProvider;
    }

    public setContentProvider(contentProvider: TreeContentProvider): void {
        this.contentProvider = contentProvider;
    }

    public getContentProvider(): TreeContentProvider {
        return this.contentProvider;
    }

    public refreshElement(element: any, callback?: () => void): void {

        // Cari di daftar selected item
        for (var i = 0; i < this.selectedItems.length; i++) {
            let item = this.selectedItems[i];
            let inputElement = item.getInputElement();
            if (inputElement === element) {
                item.refresh(callback === undefined ? () => { } : callback);
                return;
            }
        }

        // Jika tidak ada cari recursive
        this.refreshContainer(this.content, element, callback);
    }

    private refreshContainer(container: TreeItemsContainer, element: any, callback?: () => void): void {
        let items = container.getTreeItems();
        for (var i = 0; i < items.length; i++) {
            let item = items[i];
            let object = item.getInputElement();
            if (object === element) {
                item.refresh(callback === undefined ? () => { } : callback);
            } else {
                if (item instanceof TreeItemsContainer) {
                    let container = <TreeItemsContainer><any>item;
                    this.refreshContainer(container, element, callback);
                }
            }
        }
    }

    public notifySelectionChangedListener(items: TreeItem[]): void {

        // Deselect item sebelumnya
        for (var i = 0; i < this.selectedItems.length; i++) {
            let item = this.selectedItems[i];
            item.setSelected(false);
        }

        // Select item yang baru
        this.selectedItems = [];
        let models: any[] = [];
        for (var i = 0; i < items.length; i++) {
            let item = items[i];
            item.setSelected(true);
            let modelElement = item.getInputElement();
            this.selectedItems.push(item);
            models.push(modelElement);
        }

        super.notifySelectionChangedListener(models);
    }

    public setInput(input: any): void {
        this.input = input;
        this.content.setInput(input);
        this.updateSize();
    }

    public getInput(): any {
        return this.input;
    }

    public expandItems(elements: any[]): void {
        let current: TreeItemsContainer = this.content;
        this.doExpandItem(current, elements, 0);

    }

    private doExpandItem(current: TreeItemsContainer, elements: any[], index: number): void {
        let input = elements[index];
        let item = this.getChildItem(current, input);
        if (item !== null) {
            item.setExpanded(true, () => {
                current = item.getItemsContainer();
                if (index === elements.length - 1) {
                    this.notifySelectionChangedListener([item]);
                }
                this.doExpandItem(current, elements, index + 1);
            });
        }
    }

    public getChildItem(container: TreeItemsContainer, input: any): TreeItem {
        let items = container.getTreeItems();
        for (let j = 0; j < items.length; j++) {
            let item = items[j];
            let inputElement = item.getInputElement();
            if (this.isEquals(inputElement, input)) {
                return item;
            }
        }
        return null;
    }

    private isEquals(element: any, other: any): boolean {
        if (this.contentProvider.isEquals !== undefined) {
            return this.contentProvider.isEquals(element, other);
        } else {
            return element === other;
        }
    }

}

export class TreeContent extends TreeItemsContainer implements ScrolledContent {

    private viewer: Viewer = null;

    constructor(parent: TreeContainer, viewer: Viewer) {
        super(jQuery("<div>"), parent);

        this.element.addClass("viewers-treeViewer-content");
        this.element.css({
            "position": "absolute",
            "top": "0",
            "left": "0",
        });
        this.viewer = viewer;
    }

    public isEnabled(): boolean {
        return this.viewer.isEnabled();
    }

    public setLeft(left: number): void {
        this.element.css("left", left + "px");
    }

    public getLeft(): number {
        let left = this.element.css("left");
        return parseFloat(left);
    }

    public setTop(top: number): void {
        this.element.css("top", top + "px");
    }

    public getTop(): number {
        let top = this.element.css("top");
        return parseFloat(top);
    }

    public getWidth(): number {
        return this.element.width();
    }

    public getHeight(): number {
        return this.element.height();
    }

    public setAvailableWidth(availableWidth: number): void {

    }

    public setAvailableHeight(availableHeight: number): void {

    }

    public getElement(): JQuery {
        return this.element;
    }

    public setInput(input: any): void {
        this.element.empty();
        let contentProvider = this.getContentProvider();
        if (contentProvider === null) {
            return;
        }
        contentProvider.getElements(input, (inputElements: any[]) => {
            for (var i = 0; i < inputElements.length; i++) {
                let inputElement = inputElements[i];
                let item = new TreeItem(this, inputElement);
                this.items.push(item);
            }
        });
    }

}

export class TreeItem extends BaseTreeContainer {

    private inputElement: any;

    private progress = false;
    private expanded = false;
    private itemToggle: TreeItemToggle;
    private itemLabel: TreeItemLabel;
    private itemChildren: TreeItemChildren;

    constructor(parent: TreeContainer, inputElement: any) {
        super(jQuery("<div>"), parent);

        this.element.addClass("viewers-treeViewer-item");
        this.element.css({
            "height": TreeViewer.ITEM_HEIGHT + "px",
        });

        this.itemToggle = new TreeItemToggle(this, inputElement);
        this.itemLabel = new TreeItemLabel(this, inputElement);
        this.itemChildren = new TreeItemChildren(this, inputElement);
        this.inputElement = inputElement;
    }

    public getInputElement(): any {
        return this.inputElement;
    }

    public remove(): void {
        this.element.remove();
    }

    public setSelected(state: boolean): void {
        this.itemLabel.setSelected(state);
    }

    public adjustHeight(): number {
        let height = TreeViewer.ITEM_HEIGHT;
        height += this.itemChildren.adjustHeight();
        this.element.height(height);
        return height;
    }

    public adjustWidth(): number {
        let width = this.itemLabel.getWidth();
        width += this.itemToggle.getWidth();
        width = Math.max(width, this.itemChildren.adjustWidth());
        this.element.width(width);
        return width;
    }

    public setExpanded(state: boolean, callback: () => void): void {
        if (this.expanded === state) {
            callback();
            return;
        }
        if (this.progress === true) {
            return;
        }
        this.expanded = state;
        this.progress = true;
        this.itemChildren.update(() => {
            this.itemToggle.update(() => {
                this.progress = false;
                this.parent.updateSize();
                callback();
            });
        });
    }

    public isExpanded(): boolean {
        return this.expanded;
    }

    public refresh(callback: () => void): void {
        this.itemChildren.update(callback);
    }

    public getItemsContainer(): TreeItemsContainer {
        return this.itemChildren;
    }

}

class TreeItemToggle {

    private parent: TreeItem;
    private element: JQuery;
    private modelElement: any;
    private width = TreeViewer.ITEM_HEIGHT;

    constructor(parent: TreeItem, modelElement: any) {

        this.parent = parent;
        this.modelElement = modelElement;
        this.element = jQuery("<span>");
        this.element.addClass("viewers-treeViewer-item-toggle");
        this.element.addClass("mdi");
        parent.append(this.element);

        let height = TreeViewer.ITEM_HEIGHT;
        this.element.css({
            "position": "absolute",
            "padding-left": "2px",
            "color": "#888",
            "cursor": "default",
            "line-height": height + "px",
            "font-size": height + "px",
            "text-align": "center",
            "width": this.width + "px",
            "height": height + "px"
        });

        this.element.on("click", () => {
            let expanded = this.parent.isExpanded();
            this.parent.setExpanded(!expanded, () => {

            });
        });

        this.update(() => { });
        this.modelElement = modelElement;
    }

    public update(callback: () => void): void {
        let provider = this.parent.getContentProvider();
        provider.hasChildren(this.modelElement, (state: boolean) => {
            if (state === true) {
                let open = "mdi-chevron-down";
                let close = "mdi-chevron-right";
                let expanded = this.parent.isExpanded();
                if (expanded === true) {
                    this.element.addClass(open);
                    this.element.removeClass(close);
                } else {
                    this.element.addClass(close);
                    this.element.removeClass(open);
                }
            }
            callback();
        });
    }

    public getWidth(): number {
        return this.width;
    }
}

class TreeItemLabel {

    private parent: TreeItem;
    private element: JQuery;
    private textElement: JQuery;
    private imageElement: JQuery;
    private modelElement: any;
    private width = webface.DEFAULT;

    constructor(parent: TreeItem, modelElement: any) {

        this.parent = parent;
        this.modelElement = modelElement;
        this.element = jQuery("<div>");
        parent.append(this.element);

        this.element.addClass("viewers-treeViewer-item-label");
        let height = TreeViewer.ITEM_HEIGHT;
        this.element.css({
            "position": "absolute",
            "padding-left": "2px",
            "padding-right": "2px",
            "left": (height) + "px",
            "height": height + "px",
            "cursor": "default",
            "display": "table"
        });
        this.element.on("click", () => {
            parent.notifySelectionChangedListener([parent]);
        });
        this.element.on("dblclick", () => {
            let expanded = parent.isExpanded();
            parent.setExpanded(!expanded, () => {

            });
        });

        this.textElement = jQuery("<span>");
        this.textElement.css({
            "padding-left": "4px",
            "padding-right": "4px",
            "white-space": "nowrap",
            "line-height": TreeViewer.ITEM_HEIGHT + "px",
            "display": "table-cell",
            "vertical-align": "middle"
        });
        this.element.append(this.textElement);

        this.update();
    }

    public setSelected(state: boolean): void {
        if (state === true) {
            this.element.css("background-color", webface.COLOR_SELECTED_SECOND);
        } else {
            this.element.css("background-color", "transparent");
        }
    }

    private update(): void {

        let provider = this.parent.getLabelProvider();

        // Text
        let text = provider.getText(this.modelElement);
        this.textElement.text(text);

        // Image
        if (this.imageElement !== undefined) {
            this.imageElement.remove();
        }
        if (provider.getImage) {
            let image = provider.getImage(this.modelElement);
            let color = provider.getImageColor === undefined ? null : provider.getImageColor(this.modelElement);
            if (!functions.isNullOrUndefined(image)) {
                this.imageElement = widgets.prependImage(this.element, image);
                this.imageElement.css({
                    "font-size": TreeViewer.ITEM_HEIGHT + "px",
                    "text-align": "center",
                    "line-height": TreeViewer.ITEM_HEIGHT + "px",
                    "color": color,
                });
            }
        }

        this.width = this.element.outerWidth();
    }

    public getWidth(): number {
        return this.width;
    }

}

class TreeItemChildren extends TreeItemsContainer {

    private modelElement: any;
    private left = TreeViewer.ITEM_HEIGHT;

    constructor(parent: TreeItem, modelElement: any) {
        super(jQuery("<div>"), parent);
        this.modelElement = modelElement;

        this.element.addClass("viewers-treeViewer-item-children");
        this.element.css({
            "position": "relative",
            "left": this.left + "px",
            "top": TreeViewer.ITEM_HEIGHT + "px"
        });

    }

    public update(callback: () => void): void {

        // Reset terlebih dahulu item yang ada
        for (var i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            item.remove();
        }
        this.items = [];

        // Ambil daftar anakan baru dari provider
        let item = <TreeItem>this.parent;
        let expanded = item.isExpanded();
        if (expanded === true) {
            let provider = this.parent.getContentProvider();
            provider.getChildren(this.modelElement, (children: any[]) => {
                for (var i = 0; i < children.length; i++) {
                    let child = children[i];
                    let item = new TreeItem(this, child);
                    this.items.push(item);
                }
                this.parent.updateSize();
                callback();
            });
        } else {
            this.parent.updateSize();
            callback();
        }
    }

    public adjustWidth(): number {
        let width = super.adjustWidth();
        return this.left + width;
    }

}

