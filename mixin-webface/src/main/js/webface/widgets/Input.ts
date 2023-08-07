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

import Image from "webface/graphics/Image";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as functions from "webface/widgets/functions";

export default class Input extends Control {

	private textElement: JQuery = null;

	public constructor(parent: Composite, index?: number) {
		super(jQuery("<input>"), parent, index);
		this.element.addClass("widgets-input");
		this.element.css({
			"line-height": "24px"
		});
		this.element.attr("onclick", "this.value=null");
		this.element.on("input", (event: JQueryEventObject) => {
			if (this.isEnabled() === true) {
				this.sendEvent(webface.Modify, event);
			}
		});
		this.textElement = this.element;
	}

	public setName(name: string) {
		this.element.attr("name", name);
	}

	public setType(type: string) {
		this.element.attr("type", type);
	}

	public setValue(value: string) {
		this.element.attr("value", value);
	}

	public setText(text: string) {
		this.textElement.text(text);
	}

	public setPlaceholderText(text: string) {
		this.element.attr("placeholder", text);
	}

	public getValue(): string {
		return this.element.val();
	}

	public setReadOnly(state: boolean): void {
		this.element.prop("readonly", state);
	}

	protected applyEnabled(enabled: boolean): void {
		this.element.prop("disabled", !enabled);
	}

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

	public prependImage(image: Image): JQuery {
		this.prepareNestedElement();
		let element = functions.prependImage(this.element, image);
		element.css("vertical-align", "middle");
		return element;
	}

	public onChange(callback: (event: any) => void): void {
		this.element[0].addEventListener("change", callback);
	}

}
