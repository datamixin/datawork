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
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.Consolidator;
import com.andia.mixin.bekasi.ConsolidatorFormer;
import com.andia.mixin.bekasi.Enginery;
import com.andia.mixin.bekasi.Lifestage;
import com.andia.mixin.bekasi.Openstack;
import com.andia.mixin.bekasi.Reconciler;
import com.andia.mixin.bekasi.Runfactor;
import com.andia.mixin.bekasi.RunspaceRectifier;
import com.andia.mixin.bekasi.Runstack;
import com.andia.mixin.bekasi.RunstackException;
import com.andia.mixin.bekasi.Runstate;
import com.andia.mixin.bekasi.RunstateCreator;
import com.andia.mixin.bekasi.reformer.ReformerEffector;
import com.andia.mixin.bekasi.resources.RunstackFile;
import com.andia.mixin.model.EObject;
import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryItem;
import com.andia.mixin.raung.RepositoryItemList;
import com.andia.mixin.rmo.FeatureCall;
import com.andia.mixin.rmo.Modification;
import com.andia.mixin.util.TimedLogger;

public abstract class BaseRunstack implements Runstack, RunspaceRectifier, RunstateCreator, Consolidator {

	private static Logger logger = LoggerFactory.getLogger(BaseRunstack.class);

	protected Repository repository;
	protected Reconciler reconciler;
	protected Runfactor runfactor;
	private Enginery enginery;
	private String space;
	private UUID untitlesId;

	protected Map<UUID, Runstate> loaded = new LinkedHashMap<>();
	protected Map<UUID, Runstate> opened = new LinkedHashMap<>();

	public BaseRunstack(Repository repository,
			Reconciler reconciler, Runfactor runfactor, Enginery enginery) {
		this.repository = repository;
		this.reconciler = reconciler;
		this.runfactor = runfactor;
		this.enginery = enginery;
		this.space = runfactor.getSpace();
		this.untitlesId = runfactor.getUntitlesId();

		UUID folderId = runfactor.getFolderId();
		beforePopulate(repository, folderId);
		populateRunstates(folderId);
		populateUntitled(untitlesId);
	}

	protected abstract void beforePopulate(Repository repository, UUID folderId);

	private void populateRunstates(UUID folderId) {
		TimedLogger logger = new TimedLogger(BaseRunstack.logger);
		doPreloadRunstates(folderId);
		int size = loaded.size();
		logger.debugElapsedIn("Runstack preload " + size + " runstate");
	}

	private void doPreloadRunstates(UUID folderId) {

		// Loading semua file di dalam notebooks
		RepositoryItemList list = repository.loadItemList(folderId);
		RepositoryItem[] items = list.getItems();
		for (RepositoryItem item : items) {
			if (item.isFolder()) {

				// Recursive load yang dibawah folder
				UUID subFolderId = item.getId();
				doPreloadRunstates(subFolderId);

			} else {

				// Semua file di load
				UUID id = item.getId();
				preloadRunstate(id);

				// Semua yang memiliki last edit di open
				Long editing = item.getLastEditing();
				if (editing != Repository.UNDEFINED_TIME) {
					preopenRunstate(id);
				}
			}
		}
	}

	private void preloadRunstate(UUID id) {
		reformModel(id);
		Runstate runstate = createRunstate(id);
		runstate.build();
	}

	private void reformModel(UUID id) {

		try {

			// Content
			String content = repository.loadContent(id);
			ReformerEffector reformer = getReformer();
			if (reformer.willReform(content)) {
				TimedLogger logger = new TimedLogger(BaseRunstack.logger);
				String reformed = reformer.reform(content);
				repository.saveContent(id, reformed);
				logger.debugElapsedIn("Reforming model content version for " + id);
			}

			// Editing
			String editing = repository.readEditing(id);
			if (editing != null) {
				if (reformer.willReform(editing)) {
					TimedLogger logger = new TimedLogger(BaseRunstack.logger);
					String reformed = reformer.reform(editing);
					repository.keepEditing(id, reformed);
					logger.debugElapsedIn("Reforming model editing version for " + id);
				}
			}
		} catch (Exception e) {
			logger.error("Fail reforming version", e);
		}
	}

	protected abstract ReformerEffector getReformer();

	private void preopenRunstate(UUID id) {
		Runstate runstate = loaded.get(id);
		opened.put(id, runstate);
	}

	private void populateUntitled(UUID untitledId) {
		logger.debug("Preparing untitles...");
		RepositoryItemList list = repository.loadItemList(untitledId);
		RepositoryItem[] items = list.getItems();
		for (RepositoryItem item : items) {
			TimedLogger logger = new TimedLogger(BaseRunstack.logger);
			UUID fileId = item.getId();
			reformModel(fileId);
			Runstate runstate = createRunstate(fileId, false);
			runstate.build();
			opened.put(fileId, runstate);
			logger.debugElapsedIn("Preparing untitled file " + fileId);
		}
	}

	@Override
	public Runstate createRunstate(UUID id) {
		return createRunstate(id, true);
	}

	private Runstate createRunstate(UUID id, boolean asload) {
		BaseRunstate runstate = createRunstate(
				repository, space, reconciler, enginery, this, id, untitlesId);
		runstate.registerRunmodelCapability(Openstack.class, this);
		runstate.registerRunmodelCapability(Repository.class, repository);
		runstate.registerRunmodelCapability(Reconciler.class, reconciler);
		if (asload) {
			loaded.put(id, runstate);
		}
		return runstate;
	}

	protected void registerCapabilityFromRunfactor(BaseRunstate runstate, Class<?> capabilityClass) {
		Object capability = runfactor.getCapability(capabilityClass);
		runstate.registerRunmodelCapability(capabilityClass, capability);
	}

	protected abstract BaseRunstate createRunstate(Repository repository, String space,
			Reconciler reconciler, Enginery enginery, BaseRunstack runstack, UUID id, UUID untitlesId);

	@Override
	public RunstackFile openFile(UUID fileId) {
		if (loaded.containsKey(fileId)) {
			Runstate runstate = loaded.get(fileId);
			repository.placeEditing(fileId);
			opened.put(fileId, runstate);
			return createRunstackFile(fileId);
		} else if (opened.containsKey(fileId)) {
			return createRunstackFile(fileId);
		} else {
			throw new RunstackException("Missing loaded or opened file " + fileId);
		}
	}

	private RunstackFile createRunstackFile(UUID fileId) {
		RepositoryItem item = repository.loadItem(fileId);
		String name = item.getName();
		UUID parentId = item.getParentId();
		boolean untitled = parentId.equals(untitlesId);
		long lastModified = item.getLastModified();
		long lastEditing = item.getLastEditing();
		return new RunstackFile(fileId, name, parentId, untitled, lastModified, lastEditing);
	}

	@Override
	public boolean isOpened(UUID fileId) {
		return opened.containsKey(fileId);
	}

	@Override
	public Collection<RunstackFile> getOpenedList() {
		List<RunstackFile> files = new ArrayList<>();
		for (UUID fileId : opened.keySet()) {
			RunstackFile file = createRunstackFile(fileId);
			files.add(file);
		}
		return files;
	}

	@Override
	public String[] getUntitledNameList() {
		RepositoryItemList list = repository.loadItemList(untitlesId);
		return list.getItemNames();
	}

	@Override
	public RunstackFile createUntitled(String name) {

		// Buat file baru dibawah untitles
		UUID fileId = null;
		try {
			fileId = repository.createFile(untitlesId, name);
		} catch (Exception e) {
			throw new RunstackException("Cannot create untitled file " + name, e);
		}

		// File id digunakan untuk membuat runstate
		Runstate runstate = createRunstate(fileId, false);
		opened.put(fileId, runstate);

		// Untitled file awalnya committed
		RunstackFile file = createRunstackFile(fileId);
		return file;
	}

	private boolean isUntitled(UUID fileId) {
		RepositoryItem item = repository.loadItem(fileId);
		UUID parentId = item.getParentId();
		return parentId.equals(untitlesId);
	}

	@Override
	public boolean cancelUntitled(UUID fileId) {

		if (!isUntitled(fileId)) {
			throw new RunstackException("Runbook " + fileId + " is not untitled file");
		}

		// Hapus file dari daftar loaded dan opened
		Runstate runstate = opened.remove(fileId);

		// Cancel state dan hapus dari repository
		return deleteUntitled(fileId, runstate);
	}

	@Override
	public boolean closeFile(UUID fileId) {
		if (opened.containsKey(fileId)) {

			// Hapus file dari daftar opened
			Runstate runstate = opened.remove(fileId);

			// Hapus isi editing
			try {
				repository.discardEditing(fileId);
			} catch (Exception e) {
				throw new RunstackException("Fail discard editing content", e);
			}

			// Jika file adalah untitled maka hapus dari repository
			if (isUntitled(fileId)) {
				return deleteUntitled(fileId, runstate);
			} else {
				return runstate != null;
			}
		}
		return false;
	}

	private boolean deleteUntitled(UUID fileId, Runstate runstate) {
		runstate.cutoff();
		return repository.deleteFile(fileId);
	}

	@Override
	public RunstackFile getFile(UUID fileId) {
		return createRunstackFile(fileId);
	}

	private Runstate getOpened(UUID fileId) {
		if (opened.containsKey(fileId)) {
			return opened.get(fileId);
		}
		throw new RunstackException("Runstate " + fileId + " not in opened state");
	}

	@Override
	public RunstackFile saveFile(UUID fileId) {

		if (isUntitled(fileId)) {
			throw new RunstackException("Cannot save untitled model, use save-as instead");
		}

		Runstate runstate = getOpened(fileId);
		runstate.save();

		return createRunstackFile(fileId);
	}

	@Override
	public RunstackFile saveFileAs(UUID fileId, UUID folderId, String newName) {

		// Ambil run state yang lama
		Runstate oldRunstate = getOpened(fileId);

		// Save runstate ke folder dan nama yang baru
		Runstate newRunstate = oldRunstate.saveAs(folderId, newName);
		Lifestage newFilestage = newRunstate.getFilestage();
		UUID newFileId = newFilestage.getFileId();

		// Save persisted file to new file
		loaded.put(newFileId, newRunstate);

		// Hapus old file dari opened dan buka file yang baru
		opened.remove(fileId);
		opened.put(newFileId, newRunstate);

		return createRunstackFile(newFileId);

	}

	@Override
	public RunstackFile revertFile(UUID fileId) {

		if (isUntitled(fileId)) {
			throw new RunstackException("Cannot revert untitled model");
		}

		Runstate runstate = loaded.get(fileId);
		runstate.revert();
		return createRunstackFile(fileId);

	}

	@Override
	public boolean confirmDeleteFile(UUID fileId) {
		return !opened.containsKey(fileId);
	}

	@Override
	public void deleteFile(UUID fileId) {
		if (opened.containsKey(fileId)) {
			throw new RunstackException("Cannot delete while file in open state");
		}
		Runstate runstate = loaded.remove(fileId);
		runstate.delete();
	}

	@Override
	public void copyFile(UUID sourceFileId, UUID targetFileId) {
		Runstate sourceRunstate = loaded.get(sourceFileId);
		Runstate targetRunstate = sourceRunstate.copyTo(targetFileId);
		loaded.put(targetFileId, targetRunstate);
	}

	@Override
	public void renameFile(UUID fileId, String parentPath, String oldName, String newName) {

		Runstate runstate = loaded.get(fileId);
		runstate.rename();

		RenameFileFormer former = new RenameFileFormer(fileId, parentPath, oldName, newName);
		referenceRenamed(former);
	}

	protected Set<UUID> collectSiblingFiles(UUID fileId) {
		RepositoryItem item = this.repository.loadItem(fileId);
		UUID parentId = item.getParentId();
		return collectChildFiles(parentId);
	}

	private Set<UUID> collectChildFiles(UUID parentId) {
		RepositoryItemList itemList = this.repository.loadItemList(parentId);
		RepositoryItem[] items = itemList.getItems();
		Set<UUID> itemSet = new HashSet<>();
		for (RepositoryItem listItem : items) {
			UUID itemId = listItem.getId();
			itemSet.add(itemId);
		}
		return itemSet;
	}

	@Override
	public void changeFullPath(UUID folderId, String oldPath, String newPath) {

		// Change in fullPath format
		ChangeFullPathFormer former = new ChangeFullPathFormer(folderId, oldPath, newPath);
		referenceRenamed(former);
	}

	@Override
	public void changeFileFolder(UUID fileId, UUID oldFolderId, String oldFolder, String newFolder, String fileName) {
		ConsolidatorFormer former = new FileFolderFormer(fileId, oldFolderId, oldFolder, newFolder, fileName);
		referenceRenamed(former);
	}

	@Override
	public UUID[] dependentFiles(UUID fileId, String filePath, String fileName) {
		DependentFilesFormer former = new DependentFilesFormer(fileId, filePath, fileName);
		Set<UUID> files = new HashSet<>();
		referenceDependent(files, former);
		return files.toArray(new UUID[0]);
	}

	private void referenceDependent(Set<UUID> files, ConsolidatorFormer former) {
		Map<UUID, Set<Object>> pointed = referencePointed(former);
		files.addAll(pointed.keySet());
	}

	@Override
	public EObject getModel(UUID fileId) {
		Runstate runstate = getOpened(fileId);
		return runstate.getModel();
	}

	@Override
	public void setModel(UUID fileId, EObject model) {
		Runstate runstate = getOpened(fileId);
		runstate.setModel(model);
	}

	@Override
	public void applyModification(UUID fileId, Modification modification) {
		Runstate runstate = getOpened(fileId);
		runstate.modify(modification);
	}

	@Override
	public Object checkupState(UUID fileId, FeatureCall call) {
		Runstate runstate = getOpened(fileId);
		return runstate.checkupState(call);
	}

	@Override
	public Object inspectValue(UUID fileId, FeatureCall call) {
		Runstate runstate = getOpened(fileId);
		return runstate.inspectValue(call);
	}

	@Override
	public Object performAction(UUID fileId, FeatureCall call) {
		if (opened.containsKey(fileId)) {
			Runstate runstate = opened.get(fileId);
			return runstate.performAction(call);
		} else {
			if (loaded.containsKey(fileId)) {
				Runstate runstate = loaded.get(fileId);
				return runstate.performAction(call);
			} else {
				throw new RunstackException("Runbook " + fileId + " not in loaded state");
			}
		}
	}

	@Override
	public <T> T getFacility(UUID fileId, Class<? extends T> facilityClass) {
		if (opened.containsKey(fileId)) {
			Runstate runstate = opened.get(fileId);
			return runstate.getFacility(facilityClass);
		} else {
			if (loaded.containsKey(fileId)) {
				Runstate runstate = loaded.get(fileId);
				return runstate.getFacility(facilityClass);
			} else {
				throw new RunstackException("Runbook " + fileId + " not in loaded state");
			}
		}
	}

}
