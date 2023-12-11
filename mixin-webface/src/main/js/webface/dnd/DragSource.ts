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
import Widget from "webface/widgets/Widget";

import DragArea from "webface/dnd/DragArea";
import DragHelper from "webface/dnd/DragHelper";

export default class DragSource {

	// Default options
	private options: JQueryUI.DraggableOptions = {
		appendTo: "body",
		distance: 10,
		delay: 40
	};

	public setHandle(widget: Widget | JQuery): void {
		if (widget instanceof Widget) {
			this.options.handle = widget.getElement();
		} else {
			this.options.handle = <JQuery>widget;
		}
	}

	public setCursorAt(object: any): void {
		this.options.cursorAt = object;
	}

	public setHelperClone(widget: Widget): void {
		this.options.helper = () => {
			let element = widget.getElement();
			let clone = element.clone();
			clone.css("cursor", "move");
			clone.css("opacity", "0.9");
			return clone;
		}
	}

	public setHelper(helper: DragHelper): void {
		this.options.helper = () => {
			return helper.call();
		};
	}

	public setContainment(area: DragArea): void {
		let control = area.getContainment();
		this.options.containment = control.getElement();
	}

	public start(start: (event: any, ui: any) => void): void {
		this.options.start = start;
	}

	public drag(drag: (event: any, ui: any) => void): void {
		this.options.drag = drag;
	}

	public stop(stop: (event: any, ui: any) => void): void {
		this.options.stop = stop;
	}

	public applyTo(widget: Widget | JQuery): void {
		let element = widget instanceof Widget ? widget.getElement() : <JQuery>widget;
		element.draggable(this.options);
	}

}
