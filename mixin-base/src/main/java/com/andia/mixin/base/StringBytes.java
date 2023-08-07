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
package com.andia.mixin.base;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import com.andia.mixin.value.MixinBytes;

public class StringBytes extends BaseBytes {

	private String string;

	public StringBytes(String mediaType, String string) {
		this.mediaType = mediaType;
		this.string = string;
		updateMetadata();
	}

	public StringBytes(String string) {
		this(MixinBytes.TEXT_PLAIN, string);
	}

	public StringBytes(StringBuffer buffer) {
		this(buffer.toString());
	}

	public StringBytes(byte[] bytes) {
		this(new String(bytes));
	}

	public StringBytes(String mediaType, byte[] bytes) {
		this(mediaType, new String(bytes));
	}

	private void updateMetadata() {
		int length = this.string.length();
		this.metadata.setByteCount(length);
	}

	@Override
	public InputStream open() {
		byte[] bytes = string.getBytes();
		return new ByteArrayInputStream(bytes);
	}

}
