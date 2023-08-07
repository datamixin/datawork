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

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.Runfactor;
import com.andia.mixin.bekasi.Runspace;
import com.andia.mixin.bekasi.RunspaceException;
import com.andia.mixin.bekasi.RunspaceRectifier;
import com.andia.mixin.bekasi.resources.RunspaceHomeList;
import com.andia.mixin.bekasi.resources.RunspaceItem;
import com.andia.mixin.bekasi.resources.RunspaceItemList;
import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryException;
import com.andia.mixin.raung.RepositoryItem;
import com.andia.mixin.util.ArrayUtils;

public class BaseRunspace implements Runspace {

	private static Logger logger = LoggerFactory.getLogger(BaseRunspace.class);

	private Repository repository;
	private Runfactor runfactor;
	private RunspaceRectifier rectifier;

	public BaseRunspace(Repository repository, Runfactor runfactor, RunspaceRectifier rectifier) {
		this.repository = repository;
		this.runfactor = runfactor;
		this.rectifier = rectifier;
	}

	@Override
	public RunspaceHomeList getHomeList() {
		String space = runfactor.getSpace();
		UUID folderId = runfactor.getFolderId();
		return new RunspaceHomeList(repository, folderId, space);
	}

	@Override
	public RunspaceItemList getItemList(UUID folderId) {
		return new RunspaceItemList(repository, folderId);
	}

	@Override
	public String[] getItemNames(UUID folderId) {
		RunspaceItemList items = getItemList(folderId);
		return items.getNames();
	}

	@Override
	public boolean isItemExists(UUID itemId) {
		return repository.isItemExists(itemId);
	}

	@Override
	public RunspaceItem createFile(UUID folderId, String name) throws RunspaceException {
		try {
			UUID id = repository.createFile(folderId, name);
			logger.debug("Create file " + name + " at " + folderId + " as " + id);
			return new RunspaceItem(repository, id);
		} catch (RepositoryException e) {
			throw new RunspaceException("Fail create file " + name, e);
		}
	}

	@Override
	public RunspaceItem createFolder(UUID folderId, String name) throws RunspaceException {
		try {
			UUID id = repository.createFolder(folderId, name);
			logger.debug("Create folder " + name + " at " + folderId + " as " + id);
			return new RunspaceItem(repository, id);
		} catch (RepositoryException e) {
			throw new RunspaceException("Fail create folder " + name, e);
		}
	}

	@Override
	public RunspaceItem getItem(UUID itemId) {
		return new RunspaceItem(repository, itemId);
	}

	@Override
	public boolean confirmDelete(UUID itemId) {
		RepositoryItem item = repository.loadItem(itemId);
		if (item.isFile()) {
			return rectifier.confirmDeleteFile(itemId);
		}
		return false;
	}

	@Override
	public void deleteItem(UUID itemId) {
		if (repository.isItemExists(itemId)) {
			RepositoryItem item = repository.loadItem(itemId);
			if (repository.deleteFile(itemId)) {
				if (item.isFile()) {
					rectifier.deleteFile(itemId);
				}
			}
		}
	}

	@Override
	public RunspaceItem[] getItemAncestors(UUID itemId) {

		// Root id for stop criteria
		RepositoryItem item = repository.loadItem(itemId);
		UUID parentId = item.getId();

		// Starter ancestor
		List<RunspaceItem> runspaceItems = new ArrayList<>();
		RunspaceItem starter = new RunspaceItem(repository, itemId);
		runspaceItems.add(starter);

		// Subsequence ancestor
		UUID folderId = runfactor.getFolderId();
		while (!parentId.equals(folderId)) {
			parentId = item.getParentId();
			RunspaceItem ancestor = new RunspaceItem(repository, parentId);
			runspaceItems.add(0, ancestor);
			item = repository.loadItem(parentId);
		}

		return runspaceItems.toArray(new RunspaceItem[0]);
	}

	@Override
	public String getFullPath(UUID itemId) {
		RunspaceItem[] ancestors = this.getItemAncestors(itemId);
		return createFullPath(ancestors);
	}

	private String getUserFullPath(UUID itemId) {
		RunspaceItem[] ancestors = this.getItemAncestors(itemId);
		RunspaceItem[] items = ArrayUtils.slice(ancestors, 1);
		String fullPath = createFullPath(items);
		return PATH_DELIMITER + fullPath;
	}

	private String createFullPath(RunspaceItem[] ancestors) {
		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < ancestors.length; i++) {
			RunspaceItem item = ancestors[i];
			String name = item.getName();
			if (i > 0) {
				buffer.append(PATH_DELIMITER);
			}
			buffer.append(name);
		}
		return buffer.toString();
	}

	@Override
	public RunspaceItem renameItem(UUID itemId, String newName) {
		RepositoryItem item = repository.loadItem(itemId);
		UUID parentId = item.getParentId();
		String oldName = item.getName();
		String oldPath = getUserFullPath(itemId);
		repository.renameItem(itemId, newName);
		if (item.isFile()) {
			String parentPath = getUserFullPath(parentId);
			rectifier.renameFile(itemId, parentPath, oldName, newName);
		} else {
			String newPath = getUserFullPath(itemId);
			rectifier.changeFullPath(parentId, oldPath, newPath);
		}
		return getItem(itemId);
	}

	@Override
	public RunspaceItem moveItem(UUID itemId, UUID folderId) {
		RepositoryItem item = repository.loadItem(itemId);
		UUID parentId = item.getParentId();
		String oldPath = getUserFullPath(itemId);
		String oldFolder = getUserFullPath(parentId);
		if (repository.moveItem(itemId, folderId)) {
			String newFolder = getUserFullPath(folderId);
			if (item.isFile()) {
				String fileName = item.getName();
				rectifier.changeFileFolder(itemId, parentId, oldFolder, newFolder, fileName);
			} else {
				String newPath = getUserFullPath(itemId);
				rectifier.changeFullPath(itemId, oldPath, newPath);
			}
		}
		return getItem(itemId);
	}

	@Override
	public RunspaceItem copyItem(UUID itemId, UUID folderId, String newName) throws RunspaceException {
		RepositoryItem item = repository.loadItem(itemId);
		if (item.isFile()) {
			try {
				UUID copiedItem = repository.copyFile(itemId, folderId, newName);
				if (copiedItem != null) {
					rectifier.copyFile(itemId, copiedItem);
					return new RunspaceItem(repository, copiedItem);
				} else {
					throw new RunspaceException("Fail copy file");
				}
			} catch (RepositoryException e) {
				throw new RunspaceException("Fail copy file to " + newName, e);
			}
		} else {
			throw new RunspaceException("Cannot copy folder");
		}
	}

	@Override
	public UUID[] getDependentFiles(UUID fileId) throws RunspaceException {
		RepositoryItem item = repository.loadItem(fileId);
		if (item.isFile()) {
			String fileName = item.getName();
			String filePath = getUserFullPath(fileId);
			return rectifier.dependentFiles(fileId, filePath, fileName);
		} else {
			return new UUID[0];
		}
	}

}
