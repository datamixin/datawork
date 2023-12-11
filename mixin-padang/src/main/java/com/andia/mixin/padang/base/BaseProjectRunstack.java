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
package com.andia.mixin.padang.base;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Consumer;

import com.andia.mixin.bekasi.ConsolidatorFormer;
import com.andia.mixin.bekasi.ConsolidatorPath;
import com.andia.mixin.bekasi.ConsolidatorTarget;
import com.andia.mixin.bekasi.Enginery;
import com.andia.mixin.bekasi.Lifestage;
import com.andia.mixin.bekasi.Reconciler;
import com.andia.mixin.bekasi.Runfactor;
import com.andia.mixin.bekasi.Runspace;
import com.andia.mixin.bekasi.Runstate;
import com.andia.mixin.bekasi.base.BaseRunstack;
import com.andia.mixin.bekasi.base.BaseRunstate;
import com.andia.mixin.bekasi.reformer.ReformerEffector;
import com.andia.mixin.padang.ProjectRunstack;
import com.andia.mixin.padang.ProjectRunstate;
import com.andia.mixin.padang.ProjectRunstateFactory;
import com.andia.mixin.padang.model.XProject;
import com.andia.mixin.padang.model.reformer.ProjectReformerAffector;
import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryItem;
import com.andia.mixin.rmo.Outset;
import com.andia.mixin.rmo.Regulator;

public class BaseProjectRunstack extends BaseRunstack implements ProjectRunstack, ProjectRunstateFactory {

	public BaseProjectRunstack(Repository repository, Reconciler reconciler, Runfactor runfactor, Enginery enginery) {
		super(repository, reconciler, runfactor, enginery);
	}

	@Override
	protected void beforePopulate(Repository repository, UUID folderId) {

	}

	@Override
	public XProject getModel(UUID fileId) {
		return (XProject) super.getModel(fileId);
	}

	@Override
	protected ReformerEffector getReformer() {
		return ProjectReformerAffector.getInstance();
	}

	@Override
	public ProjectRunstate createRunstate(UUID id) {
		return (ProjectRunstate) super.createRunstate(id);
	}

	@Override
	protected BaseRunstate createRunstate(Repository repository, String space,
			Reconciler reconciler, Enginery enginery, BaseRunstack runstack, UUID id,
			UUID untitlesId) {
		BaseProjectRunstate runstate = new BaseProjectRunstate(
				repository, space, reconciler, this, enginery, runstack, id, untitlesId);
		return runstate;
	}

	@Override
	public String getFullPath(UUID fileId) {
		List<String> paths = new ArrayList<>();
		UUID currentId = fileId;
		UUID folderId = runfactor.getFolderId();
		while (!currentId.equals(folderId)) {
			RepositoryItem item = repository.loadItem(currentId);
			if (item == null) {
				break;
			}
			String name = item.getName();
			paths.add(0, name);
			currentId = item.getParentId();
		}
		return Runspace.PATH_DELIMITER + String.join(Runspace.PATH_DELIMITER, paths);
	}

	@Override
	public void referenceCreated(ConsolidatorFormer former) {

	}

	private void collectReferenced(ConsolidatorPath path, Consumer<Runstate> consumer) {

		// Priority 1: Same file
		UUID sourceId = path.getFileId();
		if (opened.containsKey(sourceId)) {
			Runstate runstate = opened.get(sourceId);
			consumer.accept(runstate);
		}

		// Priority 2: Opened only
		for (UUID openedId : opened.keySet()) {
			if (!openedId.equals(sourceId)) {
				if (path.isIncluded(openedId)) {
					Runstate openedState = opened.get(openedId);
					consumer.accept(openedState);
				}
			}
		}

		// Priority 3: Loaded only
		for (UUID loadedId : loaded.keySet()) {
			if (!sourceId.equals(loadedId) && !opened.containsKey(loadedId)) {
				if (path.isIncluded(loadedId)) {
					Runstate loadedState = loaded.get(loadedId);
					consumer.accept(loadedState);
				}
			}
		}
	}

	@Override
	public Map<UUID, Set<Object>> referencePointed(ConsolidatorFormer former) {
		Map<UUID, Set<Object>> map = new HashMap<>();
		Set<UUID> siblingFiles = collectSiblingFiles(former);
		ConsolidatorPath[] paths = former.createPaths(siblingFiles);
		for (ConsolidatorPath path : paths) {
			collectReferenced(path, (runstate) -> {
				Set<Object> pointed = new HashSet<>();
				referencePointed(path, pointed, runstate);
				if (pointed.size() > 0) {
					Lifestage filestage = runstate.getFilestage();
					UUID fileId = filestage.getFileId();
					map.put(fileId, pointed);
				}
			});
		}
		return map;
	}

	private Set<UUID> collectSiblingFiles(ConsolidatorFormer former) {
		UUID formerFileId = former.getFileId();
		Set<UUID> siblingFiles = collectSiblingFiles(formerFileId);
		return siblingFiles;
	}

	private void referencePointed(ConsolidatorPath path, Set<Object> users, Runstate runstate) {
		Regulator regulator = runstate.getRegulator();
		if (regulator != null) {
			referencePointed(regulator, path, users);
		}
	}

	private void referencePointed(Regulator parent, ConsolidatorPath path, Set<Object> users) {
		Outset outset = parent.getOutset();
		if (outset instanceof ConsolidatorTarget) {
			ConsolidatorTarget target = (ConsolidatorTarget) outset;
			target.referencePointed(path, users);
		} else {
			for (Regulator regulator : parent.getChildren()) {
				if (regulator != null) {
					referencePointed(regulator, path, users);
				}
			}
		}
	}

	@Override
	public void referenceRenamed(ConsolidatorFormer former) {
		Set<UUID> siblingFiles = collectSiblingFiles(former);
		ConsolidatorPath[] paths = former.createPaths(siblingFiles);
		for (ConsolidatorPath path : paths) {
			collectReferenced(path, (runstate) -> {
				referenceRenamed(path, runstate);
			});
		}
	}

	private void referenceRenamed(ConsolidatorPath path, Runstate runstate) {
		Regulator regulator = runstate.getRegulator();
		if (regulator != null) {
			referenceRenamed(regulator, path);
		}
	}

	private void referenceRenamed(Regulator parent, ConsolidatorPath path) {
		Outset outset = parent.getOutset();
		if (outset instanceof ConsolidatorTarget) {
			ConsolidatorTarget target = (ConsolidatorTarget) outset;
			target.referenceRenamed(path);
		} else {
			for (Regulator regulator : parent.getChildren()) {
				if (regulator != null) {
					referenceRenamed(regulator, path);
				}
			}
		}
	}

	@Override
	public void referenceRemoved(ConsolidatorFormer former) {

	}

}
