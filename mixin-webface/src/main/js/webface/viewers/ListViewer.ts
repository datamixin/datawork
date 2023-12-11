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

import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Scrolled from "webface/widgets/Scrolled";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";
import ScrollManager from "webface/widgets/ScrollManager";
import ScrolledContent from "webface/widgets/ScrolledContent";
import ScrolledViewPort from "webface/widgets/ScrolledViewPort";

import Viewer from "webface/viewers/Viewer";
import Selection from "webface/viewers/Selection";
import LabelPane from "webface/viewers/LabelPane";
import LabelProvider from "webface/viewers/LabelProvider";
import ContentProvider from "webface/viewers/ContentProvider";
import ListViewerStyle from "webface/viewers/ListViewerStyle";
import StringLabelProvider from "webface/viewers/StringLabelProvider";
import ArrayContentProvider from "webface/viewers/ArrayContentProvider";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";
import FillLayout from "webface/layout/FillLayout";

import WebFontImage from "webface/graphics/WebFontImage";

export default class ListViewer extends Viewer implements Scrolled {

	public static ITEM_HEIGHT: number = 24;

	private scrollManager: ScrollManager;
	private viewPort: ScrolledViewPort;
	private container: ListViewerContainer;
	private input: any = null;

	constructor(parent: Composite, setting?: ListViewerStyle, index?: number) {
		super(jQuery("<div>"), parent, index);

		this.element.addClass("scrollable");
		this.element.addClass("viewers-listViewer");
		this.element.css({
			"position": "relative",
			"overflow": "hidden"
		});
		setting = jQuery.extend(new ListViewerStyle(), setting);

		this.scrollManager = new ScrollManager(this);
		this.viewPort = this.scrollManager.getViewPort();
		let viewPortElement = this.viewPort.getElement();
		this.container = new ListViewerContainer(viewPortElement, this, setting);

		this.container.addSelectionListener((selections: any[]) => {
			this.notifySelectionChangedListener(selections);
		});

		this.container.addDoubleClickListener(<DoubleClickListener>{
			dblclick: (element: any) => {
				let event = this.createItemEvent(element);
				this.notifyListeners(webface.MouseDoubleClick, event);
			}
		});
	}

	public setLabelProvider(provider: LabelProvider) {
		this.container.setLabelProvider(provider);
	}

	public setContentProvider(provider: ContentProvider) {
		this.container.setContentProvider(provider);
	}

	public setInput(input: any): void {
		this.input = input;
		this.container.setInput(input);
		this.scrollManager.layout();
		this.notifySelectionChangedListener([]);
	}

	public getInput(): any {
		return this.input;
	}

	public refresh(): void {
		if (this.input !== null) {
			this.setInput(this.input);
		}
	}

	public getScrolledElement(): JQuery {
		return this.element;
	}

	public getScrolledContent(): ScrolledContent {
		return this.container;
	}

	public setSize(width: number, height: number): void {
		super.setSize(width, height);
		this.scrollManager.layout();
		let space = ScrollManager.SCROLL_SPACE + 2;
		this.container.setAvailableWidth(width - space);
	}

	public getItemHeight() {
		return ListViewer.ITEM_HEIGHT;
	}

	public setSelection(selection: Selection, equalsFn?: (a: any, b: any) => boolean): void {
		super.setSelection(selection, equalsFn);
		this.container.setSelection(selection, equalsFn);
	}

	public setChecked(elements: any[], equalsFn?: (a: any, b: any) => boolean): void {
		this.container.setChecked(elements, equalsFn);
	}

	public getChecked(): any[] {
		return this.container.getChecked();
	}

	public isChecked(element: any): boolean {
		return this.container.isChecked(element);
	}

}

interface DoubleClickListener {

	dblclick(element: any): void;

}

class ListViewerContainer implements ScrolledContent {

	private viewer: Viewer = null;
	private style: ListViewerStyle;
	private input: any;
	private labelProvider: LabelProvider = new StringLabelProvider();
	private contentProvider: ContentProvider = new ArrayContentProvider();

	private element: JQuery;
	private requiredWidth = 0;
	private height = 0;
	private left = 0;
	private top = 0;
	private items: ListItem[] = [];
	private selectedItemIndexes: number[] = [];
	private selectionListeners: ((selections: any[]) => void)[] = [];
	private doubleClickListeners: DoubleClickListener[] = [];

	constructor(parent: JQuery, viewer: Viewer, style: ListViewerStyle) {
		this.element = jQuery("<div>");
		this.element.addClass("viewers-listViewer-container");
		this.element.css({
			"position": "relative"
		})
		parent.append(this.element);
		this.viewer = viewer;
		this.style = style;
	}

	private clearSelectedElements() {
		for (let i = 0; i < this.selectedItemIndexes.length; i++) {
			let index = this.selectedItemIndexes[i];
			let item = this.items[index];
			item.setSelected(false);
		}
		this.selectedItemIndexes = [];
	}

	private notifySelectionListeners(): void {
		let selections: any[] = [];
		for (let i = 0; i < this.selectedItemIndexes.length; i++) {
			let index = this.selectedItemIndexes[i];
			let item = this.items[index];
			selections.push(item.getProviderElement());
		}
		for (let i = 0; i < this.selectionListeners.length; i++) {
			let listener = this.selectionListeners[i];
			listener(selections);
		}
	}

	private notifyDoubleClickListeners(element: any): void {
		for (let i = 0; i < this.doubleClickListeners.length; i++) {
			let listener = this.doubleClickListeners[i];
			listener.dblclick(element);
		}
	}

	public setLabelProvider(provider: LabelProvider): void {
		this.labelProvider = provider;
	}

	public setContentProvider(provider: ContentProvider): void {
		this.contentProvider = provider;
	}

	public setInput(input: any): void {

		this.input = input;

		for (let i = 0; i < this.items.length; i++) {
			let item = this.items[i];
			item.remove();
		}

		this.items = [];
		this.selectedItemIndexes = [];

		this.requiredWidth = 0;
		let elementCount = this.contentProvider.getElementCount(input);

		// Buat item sejumlah elementCount
		this.height = 0;
		for (let i = 0; i < elementCount; i++) {

			let item = new ListItem(this.element, this.style,
				this.labelProvider, this.contentProvider, input, i);

			// Response item click
			item.addClickListener((item: ListItem) => {

				let index = item.getIndex();
				if (this.style.mark === ListViewerStyle.CHECK) {

					// Style check bisa beberapa check
					let checked = item.isChecked();
					if (checked) {
						let pos = this.selectedItemIndexes.indexOf(index);
						this.selectedItemIndexes.splice(pos, 1);
					}
					this.selectedItemIndexes.push(index);
					item.setChecked(!checked);

				} else {

					// Style select hanya bisa satu selection
					this.clearSelectedElements();
					this.selectedItemIndexes.push(index);

				}

				item.setSelected(true);
				this.notifySelectionListeners();

			});

			// Response item double click
			item.addDblclickListener((item: ListItem) => {
				let element = item.getProviderElement();
				this.notifyDoubleClickListeners(element);
			});

			// Hitung with yang dibutuhkan
			let requiredWidth = item.getRequiredWidth();
			this.requiredWidth = Math.max(this.requiredWidth, requiredWidth);
			this.items.push(item);

			this.height += ListViewer.ITEM_HEIGHT;
		}

		this.updateItemsWidth();
	}

	private updateItemsWidth(): void {
		for (let i = 0; i < this.items.length; i++) {
			let item = this.items[i];
			item.setAdjustWidth(this.requiredWidth);
		}
	}

	public isEnabled(): boolean {
		return this.viewer.isEnabled();
	}

	public setTop(top: number): void {
		this.top = top;
		this.element.css("top", top);
	}

	public getTop(): number {
		return this.top;
	}

	public setLeft(left: number): void {
		this.left = left;
		this.element.css("left", left);
	}

	public getLeft(): number {
		return this.left;
	}

	public setAvailableWidth(availableWidth: number): void {
		this.requiredWidth = Math.max(this.requiredWidth, availableWidth);
		this.updateItemsWidth();
	}

	public setAvailableHeight(_availableHeight: number): void {

	}

	public getHeight(): number {
		return this.height;
	}

	public getWidth(): number {
		return this.requiredWidth;
	}

	public getElement(): JQuery {
		return this.element;
	}

	public setSelection(selection: Selection, equalsFn?: (a: any, b: any) => boolean): void {
		this.clearSelectedElements();
		let array = selection.toArray()
		let count = this.contentProvider.getElementCount(this.input);
		for (let item of array) {
			for (let i = 0; i < count; i++) {
				let element = this.contentProvider.getElement(this.input, i);
				if (this.isEquals(item, element, equalsFn)) {
					let item = this.items[i];
					if (this.style.mark == ListViewerStyle.SELECT) {
						item.setSelected(true);
					} else if (this.style.mark == ListViewerStyle.CHECK) {
						item.setChecked(true);
					}
					this.selectedItemIndexes.push(i);
					break;
				}
			}
			if (this.style.mark == ListViewerStyle.SELECT) {
				break;
			}
		}
		this.notifySelectionListeners();
	}

	private isEquals(a: any, b: any, equalsFn?: (a: any, b: any) => boolean): boolean {
		let equals = false;
		if (equalsFn !== undefined) {
			equals = equalsFn(a, b);
		} else {
			equals = functions.isEquals(a, b);
		}
		return equals
	}

	public addSelectionListener(listener: (selections: any[]) => void): void {
		this.selectionListeners.push(listener);
	}

	public addDoubleClickListener(listener: DoubleClickListener): void {
		this.doubleClickListeners.push(listener);
	}

	public setChecked(elements: any[], equalsFn?: (a: any, b: any) => boolean): void {

		// Buat copy checked
		let checked: any[] = [];
		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			checked.push(element);
		}

		// Cari di semua item untuk semua elements.
		for (let i = 0; i < this.items.length; i++) {

			let item = this.items[i];
			let applied: boolean = false;
			for (let j = 0; j < checked.length; j++) {
				let check = checked[j];
				let element = item.getProviderElement()
				if (this.isEquals(check, element, equalsFn)) {
					item.setChecked(true);
					applied = true;
					checked.splice(j, 1); // Untuk mempercepat pencarian.
					break;
				}
			}

			if (applied === false) {
				item.setChecked(false);
			}

		}

	}

	public getChecked(): any[] {
		let elements: any[] = [];
		for (let i = 0; i < this.items.length; i++) {
			let item = this.items[i];
			if (item.isChecked() === true) {
				elements.push(item.getProviderElement());
			}
		}
		return elements;
	}

	public isChecked(element: any): boolean {
		for (let i = 0; i < this.items.length; i++) {
			let item = this.items[i];
			if (item.getProviderElement() === element) {
				if (item.isChecked() === true) {
					return true;
				}
			}
		}
		return false;
	}
}

class ListItem {

	private clickListeners: ((item: ListItem) => void)[] = [];
	private dblclickListeners: ((item: ListItem) => void)[] = [];
	private providerElement: any = null;
	private element: JQuery = null;
	private composite: Composite = null;
	private pane: LabelPane = null;
	private index: number;
	private checked: boolean = false;
	private requiredWidth: number = 0;

	constructor(parent: JQuery, style: ListViewerStyle, labelProvider: LabelProvider,
		contentProvider: ContentProvider, input: any, index: number) {

		// Buat element
		this.element = jQuery("<div>");
		this.element.addClass("viewers-listViewer-item");
		this.element.css({
			"position": "relative",
			"line-height": ListViewer.ITEM_HEIGHT + "px",
			"cursor": "default",
			"width": "100%",
		});
		this.element.height(ListViewer.ITEM_HEIGHT);
		parent.append(this.element);

		// Response click
		this.element.on("click", (event: JQueryEventObject) => {
			event.stopPropagation();
			for (let i = 0; i < this.clickListeners.length; i++) {
				let listener = this.clickListeners[i];
				listener(this);
			}
		});

		// Response double click
		this.element.on("dblclick", (event: JQueryEventObject) => {
			event.stopPropagation();
			for (let i = 0; i < this.dblclickListeners.length; i++) {
				let listener = this.dblclickListeners[i];
				listener(this);
			}
		});

		// Ambil pane dari provider atau gunakan default
		if (labelProvider.getPane) {
			this.pane = labelProvider.getPane() || null;
		}
		if (this.pane === null) {
			this.pane = new DefaultLabelPane(labelProvider, style);
		}

		// Buat composite untuk menampung Pane
		this.composite = new Composite(this.element);
		let layout = new FillLayout();
		this.composite.setLayout(layout);
		this.pane.createControl(this.composite);

		// Apply element ke pane
		this.providerElement = contentProvider.getElement(input, index);
		this.pane.applyElement(this.providerElement);

		// Ambil width jika default pane
		if (this.pane instanceof DefaultLabelPane) {
			let pane = <DefaultLabelPane>this.pane;
			this.requiredWidth = pane.getRequiredWidth();
		}

		this.index = index;

	}

	public addClickListener(listener: (item: ListItem) => void): void {
		this.clickListeners.push(listener);
	}

	public addDblclickListener(listener: (item: ListItem) => void): void {
		this.dblclickListeners.push(listener);
	}

	public getIndex(): number {
		return this.index;
	}

	public setSelected(selected: boolean): void {
		if (this.pane instanceof DefaultLabelPane) {
			let pane = <DefaultLabelPane>this.pane;
			pane.showSelected(selected);
		}
	}

	public setChecked(checked: boolean): void {
		this.checked = checked;
		if (this.pane instanceof DefaultLabelPane) {
			let pane = <DefaultLabelPane>this.pane;
			pane.showChecked(checked);
		}
	}

	public isChecked(): boolean {
		return this.checked;
	}

	public getProviderElement(): any {
		return this.providerElement;
	}

	public remove(): void {
		this.element.remove();
	}

	public getRequiredWidth(): number {
		let minSize = this.composite.computeSize();
		let minWidth = minSize.x - (ScrollManager.SCROLL_SPACE);
		return Math.max(minWidth, this.requiredWidth);
	}

	public setAdjustWidth(requiredWidth: number): void {
		this.composite.setSize(requiredWidth, webface.DEFAULT);
		this.composite.relayout();
	}

}

class DefaultLabelPane implements LabelPane {

	private static MARK_WIDTH = 24;
	private static IMAGE_WIDTH = 24;

	private provider: LabelProvider = null;
	private style: ListViewerStyle = null;
	private composite: Composite = null;
	private markIcon: WebFontIcon = null;
	private imageIcon: WebFontIcon = null;
	private textLabel: Label = null;

	constructor(provider: LabelProvider, style: ListViewerStyle) {
		this.provider = provider;
		this.style = style;
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("viewers-listViewer-default-label-pane");
		element.css("width", "100%");
		element.css("height", "inherit");

		let layout = new GridLayout(3, 4, 0, 4, 0);
		this.composite.setLayout(layout);

		this.createMarkIcon(this.composite);
		this.createImageIcon(this.composite);
		this.createTextLabel(this.composite);
	}

	private createMarkIcon(parent: Composite): void {

		this.markIcon = new WebFontIcon(parent);
		this.markIcon.addClass("mdi");

		if (this.style.mark == ListViewerStyle.CHECK) {
			this.markIcon.addClass("mdi-checkbox-blank-outline");
		}

		let size = this.style.mark === ListViewerStyle.NONE ? 0 : DefaultLabelPane.MARK_WIDTH;
		let element = this.markIcon.getElement();
		element.css("font-size", size + "px");
		element.css("font-weight", "bold");
		element.css("color", "#6CC26C");

		let layoutData = new GridData(size, true);
		this.markIcon.setLayoutData(layoutData);

	}

	private createImageIcon(parent: Composite): void {

		this.imageIcon = new WebFontIcon(parent);

		let size = this.style.mark ? DefaultLabelPane.IMAGE_WIDTH : 0;
		let element = this.imageIcon.getElement();
		element.css("font-size", DefaultLabelPane.IMAGE_WIDTH + "px");
		element.css("color", "#888");

		let layoutData = new GridData(size, true);
		this.imageIcon.setLayoutData(layoutData);

	}

	private createTextLabel(parent: Composite): void {

		this.textLabel = new Label(parent);

		let layoutData = new GridData(true, true);
		this.textLabel.setLayoutData(layoutData);

	}

	public applyElement(element: any): void {

		let text = this.provider.getText(element);
		this.textLabel.setText(text);

		if (this.style.image === true) {
			let image = <WebFontImage>this.provider.getImage(element);
			let classes = image.getClasses();
			for (let aclass of classes) {
				this.imageIcon.addClass(aclass);
			}
		}
	}

	public showSelected(selected: boolean): void {

		let element = this.composite.getElement();
		if (selected === true) {
			element.addClass("selected");
		} else {
			element.removeClass("selected");
		}

		if (this.style.mark !== ListViewerStyle.NONE) {
			let icon = "mdi-check-bold";
			if (selected === true) {
				this.markIcon.addClass(icon);
			} else {
				this.markIcon.removeClass(icon);
			}
		}
	}

	public showChecked(checked: boolean): void {
		if (this.style.mark !== ListViewerStyle.NONE) {
			let marked = "mdi-checkbox-marked-outline";
			let blank = "mdi-checkbox-blank-outline";
			if (checked === true) {
				this.markIcon.addClass(marked);
				this.markIcon.removeClass(blank);
			} else {
				this.markIcon.addClass(blank);
				this.markIcon.removeClass(marked);
			}
		}
	}

	public getRequiredWidth(): number {

		// Hitung lebar text
		let text = this.textLabel.getText();
		let element = this.textLabel.getElement();
		let textWidth = functions.measureTextWidth(element, text);

		// Lebat total adalah mark ditambah text
		let width = DefaultLabelPane.MARK_WIDTH + textWidth;

		let layout = <GridLayout>this.composite.getLayout();
		let spacing = layout.horizontalSpacing;
		let margin = layout.marginWidth;

		let children = this.composite.getChildren();
		let totalChild = children.length;
		if (totalChild > 0) {
			width += ((totalChild - 1) * +spacing) + (margin * 2);
		}
		return width;
	}

	public getControl(): Control {
		return this.composite;
	}

}

