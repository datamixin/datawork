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
package com.andia.mixin.bekasi.visage;

import com.andia.mixin.value.MixinText;
import com.andia.mixin.value.MixinTextMetadata;

public class VisageText extends VisageConstant implements MixinText {

	private VisageTextMetadata metadata = new VisageTextMetadata();
	private String value;

	public VisageText() {
		super(VisageText.class);
	}

	public VisageText(String string) {
		this();
		this.init(string);
	}

	@Override
	public void init(Object source) {
		super.init(source);
		if (source instanceof MixinText) {
			MixinText text = (MixinText) source;
			value = text.getValue();
			MixinTextMetadata metadata = text.getMetadata();
			this.metadata = new VisageTextMetadata(metadata);
		} else if (source instanceof MixinText) {
		} else {
			init((String) source);
			int length = value.length();
			metadata.setCharacterCount(length);
		}
	}

	private void init(String source) {
		this.value = source;
	}

	@Override
	public VisageTextMetadata getMetadata() {
		return metadata;
	}

	@Override
	public String getValue() {
		return value;
	}

	@Override
	public String info() {
		int length = value.length();
		Object characters = value == null ? null : length;
		return "{@class:Text, characters:" + characters + "}";
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof VisageText) {
			VisageText text = (VisageText) obj;
			return value.equals(text.value);
		}
		return false;
	}

	@Override
	public String toString() {
		return "VisageText(" + value + ")";
	}

}
