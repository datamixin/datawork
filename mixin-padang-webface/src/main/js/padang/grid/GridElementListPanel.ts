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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import VisageMutation from "padang/visage/VisageMutation";

import * as view from "padang/view/view";

import GridOperations from "padang/grid/GridOperations";
import GridElementPanel from "padang/grid/GridElementPanel";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridScrollPosition from "padang/grid/GridScrollPosition";
import GridElementListPart from "padang/grid/GridElementListPart";

export default class GridElementListPanel {

	private topIndex = 0;
	private style: GridControlStyle = null;
	private actualCount = 0;
	private elementCount = 0;
	private part: GridElementListPart = null;
	private position: GridScrollPosition = null;
	private composite: Composite = null;
	private onItemSelection = (_index: number) => { };

	constructor(style: GridControlStyle, position: GridScrollPosition, part: GridElementListPart) {
		this.style = style;
		this.part = part;
		this.preparePosition(position);
	}

	private preparePosition(position: GridScrollPosition): void {
		this.position = position;
		position.addTopChanged((top: number) => {
			this.scrollTo(top);
		});
	}

	public scrollTo(top: number): void {

		// Refresh element dari newIndex sampai count 
		let newIndex = -top / this.style.rowHeight;
		let delta = Math.abs(this.topIndex - newIndex);
		let count = delta > this.elementCount ? delta : this.elementCount;
		this.topIndex = newIndex;
		let endRow = newIndex + count;
		endRow = endRow > this.actualCount ? this.actualCount : endRow;
		this.part.refreshElementRange(0, newIndex, endRow);

		// Scroll allowance element setelah last row
		let last = 0;
		for (let i = this.elementCount; i >= 0; i--) {
			let control = this.getControlAt(i);
			if (control !== null) {
				let element = control.getElement();
				if (i >= this.actualCount - newIndex) {
					element.hide();
				} else {
					element.show();
					last = i > last ? i : last;
				}
			}
		}

		// Last shown element
		let control = this.getControlAt(last);
		if (control !== null) {
			let panel = <GridElementPanel>control.getData();
			this.part.lastShownElement(panel);
		}

	}

	public createControl(parent: Composite, index?: number) {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("padang-grid-element-list-panel");

		view.setAbsoluteLayout(this.composite);

	}

	public setOnItemSelection(callback: (index: number) => void) {
		this.onItemSelection = callback;
	}

	private createElement(index: number): GridElementPanel {

		// Tambahkan element
		this.shiftNextElement(index, 1);
		let panel = this.part.createElementPanel();
		panel.createControl(this.composite, index);
		panel.setOnSelection((control: Control) => {
			let children = this.composite.getChildren();
			let index = children.indexOf(control);
			this.onItemSelection(index);
		});

		// Isi element
		let layoutData = view.setAbsoluteData(panel, 0, index * this.style.rowHeight);
		layoutData.height = this.style.rowHeight;
		this.part.postElementCreate(panel);

		return panel;
	}

	private shiftNextElement(index: number, count: number): void {
		this.forEachElement((panel: GridElementPanel) => {
			let layoutData = view.getAbsoluteData(panel);
			let position = <number>layoutData.top / this.style.rowHeight;
			if (position >= index) {
				layoutData.top = <number>layoutData.top + this.style.rowHeight * count;
			}
		});
	}

	private removeElement(index: number): void {
		let control = this.getControlAt(index);
		control.dispose();
		this.shiftNextElement(index, -1);
	}

	public forEachElement(callback: (panel: GridElementPanel) => void): void {
		let children = this.composite.getChildren();
		for (let child of children) {
			let rowPanel = <GridElementPanel>child.getData();
			callback(rowPanel);
		}
	}

	public getTopIndex(): number {
		return this.topIndex;
	}

	private getControlAt(index: number): Control {
		let point = this.style.rowHeight * index;
		let children = this.composite.getChildren();
		for (let child of children) {
			let layoutData = view.getAbsoluteData(child);
			if (point == layoutData.top) {
				return child;
			}
		}
		return null;
	}

	public getPanelAt(position: number): GridElementPanel {
		let index = position - this.topIndex;
		let control = this.getControlAt(index);
		if (control !== null) {
			return <GridElementPanel>control.getData();
		} else {
			return null;
		}
	}

	public getElementCount(): number {
		let children = this.composite.getChildren();
		return children.length;
	}

	public getActualCount(): number {
		return this.actualCount;
	}

	public getPositionOf(control: Control): number {
		let layoutData = view.getAbsoluteData(control);
		return <number>layoutData.top / this.style.rowHeight;
	}

	public refresh(rowCount: number): void {
		this.actualCount = rowCount;
		this.refreshContent();
	}

	public refreshContent(): void {

		// Dispose all children
		let children = this.composite.getChildren();
		for (let control of children) {
			control.dispose();
		}

		// Create children
		this.elementCount = this.calculateElementCount();
		for (let i = 0; i < this.elementCount; i++) {
			this.createElement(i);
		}

		// Refresh elements
		let lastIndex = this.topIndex + this.elementCount;
		if (lastIndex > this.actualCount) {
			lastIndex = this.actualCount;
			this.topIndex = this.actualCount - this.elementCount + 2;
		}
		this.part.refreshElementRange(0, this.topIndex, lastIndex);
	}

	private calculateElementCount(): number {
		let requiredHeight = this.actualCount * this.style.rowHeight;
		let usableHeight = this.position.getUsableHeight();
		let elementCount = Math.ceil(requiredHeight / this.style.rowHeight);
		if (usableHeight < requiredHeight) {
			elementCount = Math.ceil(usableHeight / this.style.rowHeight) + 1;
		}
		return elementCount;
	}

	public mutate(mutation: VisageMutation, callback?: () => void): void {

		// Siapkan data mutation
		let operation = mutation.getType();
		let rowCount = mutation.getRowCount();
		let rowStart = mutation.getRowStart();
		let rowEnd = mutation.getRowEnd();

		// Cari start dan end pos yang tampil sekarang
		let children = this.composite.getChildren();
		let visibleStart = this.actualCount;
		let visibleEnd = 0;
		for (let child of children) {
			let layoutData = view.getAbsoluteData(child);
			let top = <number>layoutData.top;
			let pos = top / this.style.rowHeight;
			if (visibleStart > pos) visibleStart = pos;
			if (visibleEnd < pos + 1) visibleEnd = pos + 1;
		}
		visibleStart += this.topIndex;
		visibleEnd += this.topIndex;

		// Manage daftar element jika masih ada spare dan kendalikan visibleEnd
		let usableHeight = this.position.getUsableHeight();
		let usableCount = Math.ceil(usableHeight / this.style.rowHeight);
		let spareCount = usableCount - this.elementCount;

		if (operation === GridOperations.ROW_INSERT) {

			if (rowCount < usableCount) {
				let createCount = rowEnd - rowStart;
				createCount = Math.min(createCount, spareCount);
				for (let i = rowStart; i < rowStart + createCount; i++) {
					this.createElement(i);
				}
				visibleEnd = visibleEnd + createCount;
			}
			this.actualCount = rowCount;
			this.elementCount = this.calculateElementCount();

		} else if (operation === GridOperations.ROW_DELETE) {

			if (rowCount < usableCount) {
				let removeCount = rowEnd - rowStart;
				removeCount = Math.min(removeCount, spareCount);
				for (let i = rowStart; i < rowStart + removeCount; i++) {
					this.removeElement(i);
				}
				visibleEnd = visibleEnd - removeCount;
			}
			this.actualCount = rowCount;
			this.elementCount = this.calculateElementCount();

		}

		// Cari start-end refresh
		let refreshStart = rowStart;
		let refreshEnd = rowStart;
		if (rowStart < visibleStart) {
			if (rowEnd >= visibleStart) {
				refreshStart = visibleStart;
				if (operation === GridOperations.ROW_UPDATE) {
					refreshEnd = rowEnd;
				} else {
					refreshEnd = visibleEnd;
				}
			}
		} else {
			if (rowStart < visibleEnd) {
				refreshStart = rowStart;
				if (operation === GridOperations.ROW_UPDATE) {
					refreshEnd = rowEnd;
				} else {
					refreshEnd = visibleEnd;
				}
			}
		}

		// Hanya perlu refresh jika dibutuhkan 
		if (refreshStart < refreshEnd) {
			let element = rowStart - this.topIndex;
			this.part.refreshElementRange(element, refreshStart, refreshEnd, callback);
		} else {
			if (operation !== GridOperations.ROW_UPDATE) {
				if (callback !== undefined) {
					callback();
				}
			}
		}
	}

	public getControl(): Control {
		return this.composite;
	}

}