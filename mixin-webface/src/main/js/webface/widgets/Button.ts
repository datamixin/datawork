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
import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import TypedListener from "webface/widgets/TypedListener";

import Image from "webface/graphics/Image";

import * as webface from "webface/webface";

import * as functions from "webface/widgets/functions";

import SelectionListener from "webface/events/SelectionListener";

export default class Button extends Control {

	private textElement: JQuery = null;
	private classname: string = null;

	public constructor(parent: Composite, index?: number) {
		super(jQuery("<button>"), parent, index);
		this.element.addClass("widgets-button");
		this.element.attr("type", "button");
		this.element.addClass("btn");
		this.element.addClass("btn-sm");
		this.element.addClass("btn-default");

		// Response selection
		this.element.on("click", (event: JQueryEventObject) => {
			if (this.isEnabled()) {
				this.sendEvent(webface.Selection, event);
			}
		});

		// Awal-nya element control ini adalah text element
		this.textElement = this.element;

	}

	public setText(text: string) {
		this.textElement.text(text);
	}

	public getText(): string {
		return this.textElement.text();
	}

	/**
	 * Jadikan textElement menjadi anakan element di control
	 */
	private prepareNestedElement(): void {
		if (this.element === this.textElement) {
			let text = this.element.text();
			this.element.text(null);
			this.textElement = jQuery("<span>");
			this.textElement.text(text);
			this.textElement.css("padding-left", "4px");
			this.textElement.css("vertical-align", "middle");
			this.element.append(this.textElement);
		}
	}

	public appendImage(image: Image): JQuery {
		this.prepareNestedElement();
		let element = functions.appendImage(this.element, image);
		this.adjustImage(element);
		return element;
	}

	public prependImage(image: Image): JQuery {
		this.prepareNestedElement();
		let element = functions.prependImage(this.element, image);
		this.adjustImage(element);
		return element;
	}

	private adjustImage(element: JQuery): void {
		element.css("vertical-align", "middle");
	}

	protected applyEnabled(enabled: boolean): void {
		super.applyEnabled(enabled);
		let element = this.getElement();
		if (enabled === true) {
			if (this.classname !== null) {
				element.removeClass("btn-default");
				element.addClass(this.classname);
			}
		} else {
			let precises = ["btn-primary", "btn-success", "btn-warning", "btn-error", "btn-info"];
			for (let name of precises) {
				if (element.hasClass(name)) {
					element.removeClass(name);
					element.addClass("btn-default");
					this.classname = name;
					break;
				}
			}
		}
	}

	public addSelectionListener(listener: SelectionListener): void {
		let typedListener = new TypedListener(listener);
		this.addListener(webface.Selection, typedListener);
	}

	public onSelection(listener: (event: Event) => void): void {
		this.addListener(webface.Selection, <Listener>{
			handleEvent: (event: Event) => {
				if (this.isEnabled()) {
					listener(event);
				}
			}
		});
	}
}
