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

import com.andia.mixin.value.MixinBytes;

public abstract class BaseBytes implements MixinBytes {

	protected String mediaType = MixinBytes.TEXT_PLAIN;
	protected BaseBytesMetadata metadata = new BaseBytesMetadata();

	public BaseBytes() {

	}

	@Override
	public String getMediaType() {
		return mediaType;
	}

	public void setMediaType(String mediaType) {
		this.mediaType = mediaType;
	}

	@Override
	public BaseBytesMetadata getMetadata() {
		return metadata;
	}

	public void setMetadata(BaseBytesMetadata metadata) {
		this.metadata = metadata;
	}

}
