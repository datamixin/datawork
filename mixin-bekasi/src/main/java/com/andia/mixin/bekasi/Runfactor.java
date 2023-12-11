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
package com.andia.mixin.bekasi;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class Runfactor {

	private String space;
	private UUID folderId;
	private UUID untitlesId;
	private UUID extrasId;
	private Map<Class<?>, Object> capabilities = new HashMap<>();

	public Runfactor(String space, UUID folderId, UUID untitlesId, UUID extrasId) {
		this.space = space;
		this.folderId = folderId;
		this.untitlesId = untitlesId;
		this.extrasId = extrasId;
	}

	public String getSpace() {
		return space;
	}

	public UUID getFolderId() {
		return folderId;
	}

	public UUID getUntitlesId() {
		return untitlesId;
	}

	public UUID getExtrasId() {
		return extrasId;
	}

	public void registerCapability(Class<?> capabilityClass, Object capabilityInstance) {
		capabilities.put(capabilityClass, capabilityInstance);
	}

	@SuppressWarnings("unchecked")
	public <C> C getCapability(Class<? extends C> capabilityClass) {
		return (C) capabilities.get(capabilityClass);
	}

}
