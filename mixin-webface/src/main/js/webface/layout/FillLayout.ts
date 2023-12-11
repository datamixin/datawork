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
import ObjectMap from "webface/util/ObjectMap";

import * as webface from "webface/webface";

import Event from "webface/widgets/Event";
import Layout from "webface/widgets/Layout";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import FillData from "webface/layout/FillData";

export default class FillLayout extends Layout {

	public static RESIZE_SPACE: number = 6;
	public static MINIMUM_SIZE: number = 40;
	public static ORIGINAL_PIXELS: string = "originalPixels";
	public static PRE_RESIZED_CONTROL: string = "preResizedControl";
	public static RESIZE_COVER_CLASS = "webface-layout-fill-resize-cover";
	public static RESIZE_HANDLER_CLASS = "webface-layout-fill-resize-handler";

	public type: string = webface.VERTICAL;
	public spacing: number = 5;
	public resizable: boolean = false;
	public marginWidth: number = 0;
	public marginHeight: number = 0;
	public minimumSize: number = FillLayout.MINIMUM_SIZE;

	private resizeCover: JQuery;
	private resizeHandler: JQuery;
	private resizeShow: boolean = false;
	private resizeDragging: boolean = false;

	constructor(type?: string, marginWidth?: number, marginHeight?: number, spacing?: number) {
		super();
		if (type !== undefined) this.type = type;
		if (marginWidth !== undefined) this.marginWidth = marginWidth;
		if (marginHeight !== undefined) this.marginHeight = marginHeight;
		if (spacing !== undefined) this.spacing = spacing;
	}

	public prepare(composite: Composite): void {
		let element = composite.getElement();
		element.addClass("layout-fill");
		element.css("overflow", "hidden");
	}

	public layout(composite: Composite): void {

		let type = this.type;
		let spacing = this.spacing;
		let resizable = this.resizable;
		let children = composite.getChildren();
		let totalWeights = 0;
		let weights: number[] = [];
		let used = 0;
		let vertical = type === webface.VERTICAL;

		// Looping pertama pengumpulan semua weight
		for (var i = 0; i < children.length; i++) {

			let control = children[i];
			let element = control.getElement();
			let layoutData = control.getLayoutData();

			// Catat weight dari layout data jika ada.
			if (layoutData) {

				if (layoutData instanceof FillData) {
					let weight: number;

					if (layoutData.pixels && layoutData.pixels !== webface.DEFAULT) {

						// Pixels ada weight tidak di butuhkan.
						used += layoutData.pixels;
						weights.push(webface.DEFAULT);

					} else {

						// Pixels tidak ada weight dibutuhkan
						weight = layoutData.weight;
						weights.push(weight);
						totalWeights += weight;
					}
				} else {
					console.warn("Layout data for FillLayout must be FillData", element);
				}
			} else {
				weights.push(1); // Default weight = 1
				totalWeights++;
			}

			if (i > 0) {
				used += spacing;
			}

		}

		// Variable untuk membagi-bagi pixel 
		let area = composite.getClientArea();
		let totalPixels: number;
		let oneWeightPart: number;
		let marginWidth = this.marginWidth;
		let marginHeight = this.marginHeight;
		let left: number = marginWidth;
		let top: number = marginHeight;

		// Cari total pixel yang akan di bagi.
		if (vertical) {
			used += 2 * marginHeight;
			totalPixels = area.y - used;
		} else {
			used += 2 * marginWidth;
			totalPixels = area.x - used;
		}

		// Cari pixel untuk per satu weight
		oneWeightPart = totalPixels / totalWeights;

		// Bagi weight kesemua anakan.
		children.forEach(function(control, index) {

			// Semua element anakan harus position: absolute
			let element = control.getElement();
			element.css({
				"position": "absolute",
				"top": top,
				"left": left,
			});

			// Pixels dari weight atau pixels data
			let weight: number = weights[index];
			let pixels: number;
			if (weight === webface.DEFAULT) {
				let layoutData = <FillData>control.getLayoutData();
				pixels = layoutData.pixels;
			} else {
				pixels = oneWeightPart * weight;
			}

			// Berikan pixels ke control
			if (vertical) {
				control.setSize(area.x - 2 * marginWidth, pixels);
				top += pixels + spacing;
			} else {
				control.setSize(pixels, area.y - 2 * marginHeight);
				left += pixels + spacing;
			}
		});

		if (this.resizeHandler === undefined) {
			if (resizable === true && children.length > 1) {
				this.prepareResize(composite, vertical);
			}
		}

		this.resizeShow = false;
		if (this.resizeHandler !== undefined) {
			this.hideControl();
		}

	}

	private prepareResize(composite: Composite, vertical: boolean): void {

		let dragOrientation: string;
		let element: JQuery = composite.getElement();
		let preControl: Control;
		let postControl: Control;
		let space: number = Math.max(this.spacing, FillLayout.RESIZE_SPACE);

		element.children("." + FillLayout.RESIZE_COVER_CLASS).remove();
		element.children("." + FillLayout.RESIZE_HANDLER_CLASS).remove();

		// Resize cover berupa div yang memenuhi element
		let resizeCover = jQuery("<div>");
		resizeCover.addClass(FillLayout.RESIZE_COVER_CLASS);
		resizeCover.css("position", "absolute");
		resizeCover.css(webface.TOP, "0");
		resizeCover.css(webface.LEFT, "0");
		resizeCover.css(webface.BOTTOM, "0");
		resizeCover.css(webface.RIGHT, "0");
		element.append(resizeCover);
		this.resizeCover = resizeCover;

		let topHandler = 0;
		let leftHandler = 0;

		// Resize control berupa div selebar spacing
		let resizeHandler = jQuery("<div>");
		resizeHandler.addClass(FillLayout.RESIZE_HANDLER_CLASS);
		resizeHandler.css("z-index", 10);
		resizeHandler.css("position", "absolute");
		if (vertical === true) {
			resizeHandler.css("left", "0");
			resizeHandler.css("right", "0");
			resizeHandler.css("cursor", "ns-resize");
			resizeHandler.height(space);
			dragOrientation = "y";
		} else {
			resizeHandler.css("top", "0");
			resizeHandler.css("bottom", "0");
			resizeHandler.css("cursor", "ew-resize");
			resizeHandler.width(space);
			dragOrientation = "x";
		}
		element.append(resizeHandler);
		this.resizeHandler = resizeHandler;

		let originalPixels: number[] = [];
		this.hideControl();

		resizeHandler
			.draggable({

				axis: dragOrientation,

				start: () => {
					originalPixels = FillLayout.getChildPixels(composite, !vertical);
					this.resizeDragging = true;
					resizeCover.show();
				},

				stop: () => {

					let preElement: JQuery = preControl.getElement();
					let postElement: JQuery = postControl.getElement();
					let preData = <FillData>preControl.getLayoutData();
					let postData = <FillData>postControl.getLayoutData();
					let preMinimum = preData.minimumPixels;
					let postMinimum = postData.minimumPixels;
					preMinimum = preMinimum === webface.DEFAULT ? this.minimumSize : preMinimum;
					postMinimum = postMinimum === webface.DEFAULT ? this.minimumSize : postMinimum;

					let resizeOffset = resizeHandler.offset();
					let x: number = resizeOffset.left;
					let y: number = resizeOffset.top;

					let preHeight: number;
					let postHeight: number;
					let preWidth: number;
					let postWidth: number;
					let elementOffset = element.offset();
					let postOffset = postElement.offset();
					let more: number = this.spacing + (this.spacing - space) / 2;

					if (vertical) {

						// Hitung selisih
						let postTop = postOffset.top;
						let lastY = postTop - more;
						let delta = y - lastY;
						preHeight = preElement.outerHeight()
						postHeight = postElement.outerHeight();
						preHeight += delta;
						postHeight -= delta;

						// Kendalikan ukuran minimum
						let preConfirm = delta < 0 && preHeight > preMinimum;
						let postConfirm = delta > 0 && postHeight > postMinimum;
						if (preConfirm || postConfirm) {

							// Berikan ukuran baru
							preControl.setSize(webface.DEFAULT, preHeight);
							postControl.setSize(webface.DEFAULT, postHeight);
							postElement.css(webface.TOP, postTop + delta - elementOffset.top);
						}

					} else {

						// Hitung selisih
						let postLeft = postOffset.left;
						let lastX = postLeft - more;
						let delta = x - lastX;
						preWidth = preElement.outerWidth();
						postWidth = postElement.outerWidth();
						preWidth += delta;
						postWidth -= delta;

						// Kendalikan ukuran minimum
						let preConfirm = delta < 0 && preWidth > preMinimum;
						let postConfirm = delta > 0 && postWidth > postMinimum;
						if (preConfirm || postConfirm) {

							// Berikan ukuran baru
							preControl.setSize(preWidth, webface.DEFAULT);
							postControl.setSize(postWidth, webface.DEFAULT);
							postElement.css(webface.LEFT, postLeft + delta - elementOffset.left);
						}

					}

					this.hideControl();
					this.resizeShow = false;
					this.resizeDragging = false;

					let eventData = new ObjectMap<any>();
					eventData.put(FillLayout.ORIGINAL_PIXELS, originalPixels);
					eventData.put(FillLayout.PRE_RESIZED_CONTROL, preControl);

					// Notify ke listener
					let event = new Event();
					event.type = webface.ChildResize;
					event.widget = composite;
					event.data = eventData;
					composite.notifyListeners(webface.ChildResize, event);
				}

			});

		// Pasang mousemove listener untuk menempatkan handler
		element.on("mousemove", (event) => {

			if (this.resizeDragging) {
				return;
			}

			let childControl: Control;
			let childElement: JQuery;
			let distance: number;
			let half: number;
			let index: number;
			let more: number = space - (space - this.spacing) / 2;

			let controls = composite.getChildren();

			if (vertical) {

				for (index = 1; index < controls.length; index++) {
					childControl = controls[index];
					childElement = childControl.getElement();
					half = space / 2;

					// top adalah posisi absolute childElement terhadap parent-nya
					let top = Math.abs(element.offset().top - childElement.offset().top);

					// distance adalah jarak hasil kurang posisi absolute kursor dengan top parent dan top child-nya.
					distance = Math.abs(event.pageY - element.offset().top - top);

					if (distance <= half) {
						preControl = controls[index - 1];
						postControl = childControl;
						topHandler = top;
						this.resizeShow = true;
						break;
					}
				}

				if (this.resizeShow) {
					this.showControl();
					resizeHandler.css(webface.TOP, topHandler - more);
				} else {
					this.hideControl();
				}

			} else {

				for (index = 1; index < controls.length; index++) {
					childControl = controls[index];
					childElement = childControl.getElement();
					half = space / 2;

					let left = Math.abs(element.offset().left - childElement.offset().left);
					distance = Math.abs(event.pageX - element.offset().left - left);

					if (distance <= half) {
						preControl = controls[index - 1];
						postControl = childControl;
						leftHandler = left;
						this.resizeShow = true;
						break;
					}
				}

				if (this.resizeShow) {
					this.showControl();
					resizeHandler.css(webface.LEFT, leftHandler - more);
				} else {
					this.hideControl();
				}
			}

		});

	}

	public static getChildPixels(composite: Composite, horizontal: boolean): number[] {
		let children = composite.getChildren();
		let childPixels: number[] = [];
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			let point = child.computeSize();
			let pixels = horizontal ? point.x : point.y;
			childPixels.push(pixels);
		}
		return childPixels;
	}

	private showControl(): void {
		this.resizeHandler.show();
	}

	private hideControl(): void {
		this.resizeHandler.hide();
		this.resizeCover.hide();
	}

}

