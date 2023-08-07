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
export default class GridScrollPosition {

	private requiredWidth: number = 0;
	private requiredWidthExtra: number = 0;
	private requiredHeight: number = 0;
	private requiredHeightExtra: number = 0;
	private usableWidth: number = 0;
	private usableHeight: number = 0;

	private left: number = 0;
	private top: number = 0;
	private onLeftChangedCallbacks: ((left: number) => void)[] = [];
	private onTopChangedCallbacks: ((top: number) => void)[] = [];

	public setRequiredWidth(width: number): void {
		this.requiredWidth = width;
	}

	public setRequiredHeight(height: number): void {
		this.requiredHeight = height;
	}

	public setRequiredWidthExtra(width: number): void {
		this.requiredWidthExtra = width;
	}

	public setRequiredHeightExtra(height: number): void {
		this.requiredHeightExtra = height;
	}

	public setUsableWidth(width: number): void {
		this.usableWidth = width;
	}

	public getUsableWidth(): number {
		return this.usableWidth;
	}

	public setUsableHeight(height: number): void {
		this.usableHeight = height;
	}

	public getUsableHeight(): number {
		return this.usableHeight;
	}

	public getRequiredWidth(): number {
		return this.requiredWidth;
	}

	public getRequiredHeight(): number {
		return this.requiredHeight;
	}

	public getRequiredWidthExtra(): number {
		return this.requiredWidthExtra;
	}

	public getRequiredHeightExtra(): number {
		return this.requiredHeightExtra;
	}

	public getMinLeft(): number {
		return this.usableWidth - (this.requiredWidth + this.requiredWidthExtra);
	}

	public getMinTop(): number {
		return this.usableHeight - (this.requiredHeight + this.requiredHeightExtra);
	}

	public getLeft(): number {
		return this.left;
	}

	public getTop(): number {
		return this.top;
	}

	public setLeft(left: number, notify: boolean): void {
		this.left = left;
		if (notify === true) {
			for (let callback of this.onLeftChangedCallbacks) {
				callback(left);
			}
		}
	}

	public setTop(top: number, notify: boolean): void {
		this.top = top;
		if (notify === true) {
			for (let callback of this.onTopChangedCallbacks) {
				callback(top);
			}
		}
	}

	public refreshLeft(): void {
		this.setLeft(this.left, true);
	}

	public refreshTop(): void {
		this.setTop(this.top, true);
	}

	public addLeftChanged(callback: (left: number) => void): void {
		this.onLeftChangedCallbacks.push(callback);
	}

	public addTopChanged(callback: (top: number) => void): void {
		this.onTopChangedCallbacks.push(callback);
	}

	public changeTop(top: number): void {
		this.top = top;
		for (let callback of this.onTopChangedCallbacks) {
			callback(top);
		}
	}


}