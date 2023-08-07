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
package com.andia.mixin.model;

public class MMarkup extends MFacet {

	public static String XCLASSNAME = Mock.getEClassName("MMarkup");

	public static EAttribute FEATURE_TEXT = new EAttribute("text", EAttribute.STRING);

	public String text = null;

	public MMarkup() {
		super(Mock.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_TEXT
		});
	}

	public String getText() {
		return text;
	}

	public void setText(String newText) {
		String oldText = this.text;
		this.text = newText;
		this.eSetNotify(FEATURE_TEXT, oldText, newText);
	}

}
