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

export default class FormInput extends Control {

	public static TYPE_TEXT = "text";
	public static TYPE_HIDDEN = "hidden";
	public static TYPE_SUBMIT = "submit";
	public static TYPE_CHECKBOX = "checkbox";
	public static TYPE_PASSWORD = "password";

	public constructor(parent: Composite, type: string, name?: string, index?: number) {
		super(jQuery("<input>"), parent, index);
		this.element.attr("type", type);
		this.element.attr("name", name);
		this.element.addClass(type === FormInput.TYPE_SUBMIT ? "widgets-button" : "widgets-text");
		this.element.css("padding", type === FormInput.TYPE_SUBMIT ? "0" : "4px");
		this.element.css("margin", "0");
	}

	public setValue(text: string): void {
		this.element.val(text);
	}

}