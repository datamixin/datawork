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
package com.andia.mixin.base;

import com.andia.mixin.value.MixinTextMetadata;

public class BaseTextMetadata implements MixinTextMetadata {

	private int characterCount;

	public BaseTextMetadata() {

	}

	public BaseTextMetadata(int count) {
		this.characterCount = count;
	}

	public BaseTextMetadata(MixinTextMetadata metadata) {
		this.characterCount = metadata.getCharacterCount();
	}

	@Override
	public int getCharacterCount() {
		return characterCount;
	}

	public void setCharacterCount(int characterCount) {
		this.characterCount = characterCount;
	}

}
