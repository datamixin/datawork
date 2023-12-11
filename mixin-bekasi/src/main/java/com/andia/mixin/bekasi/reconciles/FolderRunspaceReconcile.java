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
package com.andia.mixin.bekasi.reconciles;

import java.util.UUID;

public class FolderRunspaceReconcile extends Reconcile {

	private String folderId;

	public FolderRunspaceReconcile() {
		super(FolderRunspaceReconcile.class);
	}

	public FolderRunspaceReconcile(UUID folderId) {
		super(FolderRunspaceReconcile.class);
		this.folderId = String.valueOf(folderId);
	}

	public void setFolderId(String folderId) {
		this.folderId = folderId;
	}

	public String getFolderId() {
		return folderId;
	}

	@Override
	public String info() {
		return "{type: 'FolderRunspaceReconcile', folderId: '" + folderId + "'}";
	}

}
