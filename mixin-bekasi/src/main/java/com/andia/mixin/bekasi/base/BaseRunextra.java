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
package com.andia.mixin.bekasi.base;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import com.andia.mixin.bekasi.Runextra;
import com.andia.mixin.bekasi.RunextraException;
import com.andia.mixin.bekasi.Runfactor;
import com.andia.mixin.model.EObject;
import com.andia.mixin.model.EObjectSerde;
import com.andia.mixin.raung.Directory;
import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryException;

public abstract class BaseRunextra implements Runextra {

	private Repository repository;
	private Runfactor runfactor;

	public BaseRunextra(Repository repository, Runfactor runfactor) {
		this.repository = repository;
		this.runfactor = runfactor;
	}

	private Directory getDirectory(String group) throws RepositoryException {
		UUID extrasId = runfactor.getExtrasId();
		if (!repository.isItemExists(extrasId, group)) {
			repository.createFolder(extrasId, group);
		}
		UUID groupId = repository.getItemId(extrasId, group);
		return new Directory(repository, groupId, group);
	}

	@Override
	public EObject loadModel(String group, String name) throws RunextraException {
		EObjectSerde<EObject> serde = this.createSerde();
		try {
			Directory directory = getDirectory(group);
			String contents = directory.getFileContents(name);
			return (EObject) serde.deserialize(contents);
		} catch (Exception e) {
			String message = "Fail load model " + name;
			throw new RunextraException(message, e);
		}
	}

	@Override
	public void saveModel(String group, String name, EObject model) throws RunextraException {
		EObjectSerde<EObject> serde = this.createSerde();
		try {
			String contents = serde.serialize(model);
			Directory directory = getDirectory(group);
			if (!directory.isExists(name)) {
				directory.createNewFile(name);
			}
			directory.setFileContents(name, contents);
		} catch (Exception e) {
			String message = "Fail save model " + name;
			throw new RunextraException(message, e);
		}
	}

	@Override
	public void removeModel(String group, String name) throws RunextraException {
		try {
			Directory directory = getDirectory(group);
			if (directory.isExists(name)) {
				directory.delete(name);
			}
		} catch (Exception e) {
			String message = "Fail delete model " + name;
			throw new RunextraException(message, e);
		}
	}

	@Override
	public Collection<String> getNames(String group) throws RunextraException {
		try {
			Directory directory = getDirectory(group);
			return directory.listNames();
		} catch (Exception e) {
			String message = "Fail list name " + group;
			throw new RunextraException(message, e);
		}
	}

	@Override
	public Collection<String> getNamesByType(String group, String type) throws RunextraException {
		try {
			Collection<String> names = getNames(group);
			List<String> filtered = new ArrayList<>();
			for (String name : names) {
				EObject model = loadModel(group, name);
				if (this.isTypeMatch(model, type)) {
					filtered.add(name);
				}
			}
			return filtered;
		} catch (Exception e) {
			String message = "Fail list name " + group;
			throw new RunextraException(message, e);
		}
	}

	protected abstract EObjectSerde<EObject> createSerde();

	protected abstract boolean isTypeMatch(EObject model, String type);

}
