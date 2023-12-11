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

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import com.andia.mixin.value.MixinBytes;
import com.andia.mixin.value.MixinBytesMetadata;

public class VisageBytes extends VisageValue {

	private VisageBytesMetadata metadata = new VisageBytesMetadata();
	private String mediaType;
	private String bytes;

	public VisageBytes() {
		super(VisageBytes.class);
	}

	public VisageBytes(String string) {
		this();
		this.init(string);
	}

	@Override
	public void init(Object source) {
		super.init(source);
		init((MixinBytes) source);
	}

	public VisageBytesMetadata getMetadata() {
		return metadata;
	}

	private void init(MixinBytes source) {
		this.mediaType = source.getMediaType();
		readMetadata(source);
		readBytes(source);
	}

	private void readMetadata(MixinBytes source) {
		MixinBytesMetadata metadata = source.getMetadata();
		this.metadata = new VisageBytesMetadata(metadata);
	}

	private void readBytes(MixinBytes source) {
		Charset charset = Charset.forName(StandardCharsets.UTF_8.name());
		StringBuilder builder = new StringBuilder();
		try (
				InputStream inputStream = source.open();
				InputStreamReader streamReader = new InputStreamReader(inputStream, charset);
				Reader reader = new BufferedReader(streamReader)) {
			int ch = 0;
			while ((ch = reader.read()) != -1) {
				builder.append((char) ch);
			}
			bytes = builder.toString();
		} catch (Exception e) {
			throw new VisageValueException("Fail visage bytes", e);
		}
	}

	public String getBytes() {
		return bytes;
	}

	public String getMediaType() {
		return mediaType;
	}

	@Override
	public String info() {
		return "{@class:Bytes, mediaType:'" + mediaType + "', length: " + (bytes == null ? null : bytes.length()) + "}";
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof VisageBytes) {
			VisageBytes text = (VisageBytes) obj;
			return bytes.equals(text.bytes);
		}
		return false;
	}

	@Override
	public String toString() {
		return "VisageBytes(" + bytes.length() + " bytes)";
	}

}
