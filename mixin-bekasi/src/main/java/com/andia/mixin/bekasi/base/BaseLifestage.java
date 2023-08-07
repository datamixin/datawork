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
package com.andia.mixin.bekasi.base;

import java.util.UUID;

import com.andia.mixin.bekasi.Lifestage;
import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryItem;

public class BaseLifestage implements Lifestage {

	private Stage stage = Stage.INIT;
	private Repository repository;
	private UUID fileId;
	private String space;

	public BaseLifestage(Repository repository, String space, UUID fileId) {
		this.repository = repository;
		this.space = space;
		this.fileId = fileId;
	}

	public void setStage(Stage stage) {
		this.stage = stage;
	}

	@Override
	public UUID getFileId() {
		return fileId;
	}

	@Override
	public String getFileName() {
		RepositoryItem item = repository.loadItem(fileId);
		return item.getName();
	}

	@Override
	public String getSpace() {
		return space;
	}

	@Override
	public boolean isPersisted() {
		RepositoryItem item = repository.loadItem(fileId);
		Long modified = item.getLastModified();
		return modified != null;
	}

	@Override
	public Stage getStage() {
		return stage;
	}

	@Override
	public String toString() {
		return "lifestate :{fileId :" + fileId + "}";
	}

}
