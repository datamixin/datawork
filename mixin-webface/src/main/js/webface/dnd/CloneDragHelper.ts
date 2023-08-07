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
import Control from "webface/widgets/Control";

import DragHelper from "webface/dnd/DragHelper";

export default class CloneDragHelper implements DragHelper {

	private control: Control | JQuery = null;
	private css: any = {};

	constructor(control: Control | JQuery, css?: any) {
		this.control = control;
		this.css = css;
	}

	public call(): JQuery {

		let element = this.control instanceof Control ? this.control.getElement() : <JQuery>this.control;
		let clone = element.clone();
		let width = element.width();
		let height = element.height();
		clone.css("background-color", "#E4E4E4");
		clone.css("border", "1px solid #DDD");
		clone.css("opacity", "0.8");
		clone.css("z-index", "3"); // Agar ada diatas dialog
		clone.css("width", (width + 2) + "px");
		clone.css("height", (height + 2) + "px");

		if (this.css) {
			clone.css(this.css);
		}

		// Menjadikan children yang di drag warna orange
		let children = clone.children();
		children.css("color", "#ec8700");

		return clone;
	}
}
