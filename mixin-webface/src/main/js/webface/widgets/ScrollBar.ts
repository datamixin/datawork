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
import * as webface from "webface/webface";

import ScrollListener from "webface/widgets/ScrollListener";

/**
 * ===========================================================================
 * SCROLL BAR
 * ===========================================================================
 * ScrollBar digunakan dengan memberikan minimal 4 parameter:<br>
 * 1. required : Kebutuhan ruang sebenarnya dari data yang akan ditampilkan.<br>
 * 2. available : Ruang yang tersedia di tampilan.<br>
 * 3. stepRange : Setiap satu kali pergeseran, berapa nilai yang berubah.<br>
 * 4. Listener : Yang akan dinotifikasi jika nilai di scroll berubah karena:<br>
 *    1. Handler scroll di drag (value tergantung jauhnya drag).<br>
 *    2. Ruang control di click (satu available).<br>
 * Pengguna bertanggung jawab mengubah value yang diberikan menjadi nilai yang
 * di mengerti oleh pengguna.
 */
export default class ScrollBar {

	private static CONTAINER_CLASS: string = "widgets-scrollBar-handler-container";

	private orientation: string;
	private vertical: boolean;
	private visible: boolean = true;
	private value: number = 0; // Nilai scroll sekarang dalam rentang required.
	private required: number = 0; // Jumlah nilai yang dibutuhkan
	private available: number = 0; // Jumlah nilai yang dapat ditampilkan
	private controlSize: number = 0;
	private dragDirection: string;
	private handlerContainerSize: number = 0;

	private element: JQuery;
	private handlerContainer: JQuery;
	private handlerControl: JQuery;

	private listener: ScrollListener;

	public constructor(parent: JQuery, vertical: boolean, stepRange: number, listener: ScrollListener) {

		// Tambahkan scroll element ke parent element
		this.element = jQuery("<div>");
		this.element.addClass("widgets-scrollBar");
		this.element.addClass(this.orientation);
		this.element.css({
			"overflow": "hidden",
			"position": "absolute",
		});

		if (vertical) {
			this.orientation = webface.VERTICAL;
			this.dragDirection = "y";
			this.element.css({
				"right": "0"
			});
		} else {
			this.orientation = webface.HORIZONTAL;
			this.dragDirection = "x";
			this.element.css({
				"bottom": "0"
			});
		}
		parent.append(this.element);

		// Buatkan handle container untuk termpat scroll
		this.handlerContainer = jQuery("<div>")
		this.handlerContainer.addClass(ScrollBar.CONTAINER_CLASS);

		this.handlerContainer.bind("click", (event: JQueryEventObject) => {

			let target = jQuery(event.target);
			let eventTarget = event.target;
			let delta: number;
			let offset: number;

			if (target.hasClass(ScrollBar.CONTAINER_CLASS)) {

				if (this.required > this.available) {
					delta = this.controlDeltaPosition(this.handlerControl);

					// Cross-browser mouse positioning
					let rect = eventTarget.getBoundingClientRect();
					let offsetX = event.clientX - rect.left;
					let offsetY = event.clientY - rect.top;

					if (vertical) {

						offset = offsetY;
					} else {

						offset = offsetX;
					}

					if (delta < offset) {
						this.value = this.normalize(this.value + this.available);
					} else {
						this.value = this.normalize(this.value - this.available);
					}
					this.notify(this.value, true);
					this.adjustPosition();
				}
			}

		});
		this.handlerContainer.css({
			"float": "left"
		});

		this.element.append(this.handlerContainer);

		// Handler control untuk di drag.
		this.handlerControl = jQuery("<div>");
		this.handlerControl.addClass("widgets-scrollBar-handler-control");
		this.handlerControl.draggable({

			axis: this.dragDirection,

			drag: (e: any) => {
				let delta = this.controlDeltaPosition(this.handlerControl);
				if (delta !== undefined) {
					let range = this.handlerContainerSize - this.controlSize;
					let factor = delta / range;
					let maximum = this.required - this.available;
					let value = factor * maximum;
					this.value = value;
					this.notify(value, false);
				}
			},

			stop: (e: any) => {
				this.notify(this.value, true);
			},

			containment: "parent"

		});
		this.handlerContainer.append(this.handlerControl);
		this.vertical = vertical;
		this.listener = listener;
	}

	/**
	 * Value harus dalam rentang.
	 */
	private normalize(value: number): number {
		if (this.required <= this.available) {
			return value;
		}
		let maximum = this.required - this.available;
		if (value < 0) {
			return 0;
		} else if (value >= maximum) {
			return maximum;
		}
		return value;
	}

	/**
	 * Hitung jumlah pixel dari control scroll ke parent - nya
	 */
	private controlDeltaPosition(target: JQuery): number {
		let parent: JQuery = target.parent();
		let offset = parent.offset();
		let top: number;
		let left: number;
		if (offset !== undefined) {
			if (this.orientation === webface.VERTICAL) {
				top = target.offset().top;
				if (top < 0) {
					top = 0;
				}
				return top - offset.top;
			} else {
				left = target.offset().left;
				if (left < 0) {
					left = 0;
				}
				return left - offset.left;
			}
		}
		return 0;
	}

	/**
	 * Update Listener.
	 */
	private notify(value: number, stop: boolean): void {
		this.listener.moved(value, stop);
	}

	/**
	 * Posisikan kontrol sesuai value sekarang.
	 */
	private adjustPosition(): void {
		let factor = this.value / (this.required - this.available);
		let size = this.handlerContainerSize - this.controlSize;
		let position = Math.round(factor * size);
		if (this.vertical) {
			this.handlerControl.css("top", position);
		} else {
			this.handlerControl.css("left", position);
		}
	}

	private adjustSize(): void {
		let factor: number = Math.min(1, this.available / this.required);
		this.controlSize = Math.max(Math.round(factor * this.handlerContainerSize), 20);
		let overlap = this.available < this.required;
		if (this.vertical) {
			let width = this.handlerContainer.width();
			this.handlerControl.outerWidth(overlap ? width : 0);
			this.handlerControl.outerHeight(overlap ? this.controlSize : 0);
		} else {
			let height = this.handlerContainer.height();
			this.handlerControl.outerWidth(overlap ? this.controlSize : 0);
			this.handlerControl.outerHeight(overlap ? height : 0);
		}
		this.adjustPosition();
	}

	public getElement(): JQuery {
		return this.element;
	}

	public getHandlerElement(): JQuery {
		return this.handlerControl;
	}

	/**
	 * Siapkan scroll untuk digunakan.
	 */
	public prepare(required: number, available: number, width: number, height: number): void {

		this.required = required;
		this.available = available;

		this.element.width(width);
		this.element.height(height);

		this.handlerContainer.addClass(this.orientation);
		if (this.vertical) {
			this.handlerContainerSize = height;
			this.handlerContainer.width(width);
			this.handlerContainer.height(this.handlerContainerSize);
			this.handlerControl.outerWidth(this.available > this.required ? 0 : width);
		} else {
			this.handlerContainerSize = width;
			this.handlerContainer.width(this.handlerContainerSize);
			this.handlerContainer.height(height);
			this.handlerControl.outerHeight(this.available > this.required ? 0 : height);
		}

		this.adjustSize();

	}

	public setValue(value: number): void {
		this.value = this.normalize(value);
		this.adjustPosition();
	}

	public isVisible(): boolean {
		return this.visible;
	}

	public setVisible(show: boolean) {
		if (this.visible === show) {
			return;
		}
		this.visible = show;
		if (this.visible) {
			this.element.show();
		} else {
			this.element.hide();
		}
	}

	public getAvailable(): number {
		return this.available;
	}

	public setAvailable(available: number): void {
		this.available = available;
	}

	public getRequired(): number {
		return this.required;
	}

	public setRequired(required: number): void {
		this.required = required;
		this.adjustSize();
	}
}
