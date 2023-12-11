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

import com.andia.mixin.value.MixinTextMetadata;

public class VisageTextMetadata extends VisageValue implements MixinTextMetadata {

	private int characterCount;

	public VisageTextMetadata() {
		super(VisageTextMetadata.class);
	}

	public VisageTextMetadata(MixinTextMetadata metadata) {
		this();
		characterCount = metadata.getCharacterCount();
	}

	public void setCharacterCount(int characterCount) {
		this.characterCount = characterCount;
	}

	@Override
	public int getCharacterCount() {
		return characterCount;
	}

	@Override
	public String info() {
		return "{@class:TextMetadata, characterCount: " + characterCount + "}";
	}

}
