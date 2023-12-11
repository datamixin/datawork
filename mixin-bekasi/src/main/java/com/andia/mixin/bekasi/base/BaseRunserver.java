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

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.Enginery;
import com.andia.mixin.bekasi.Reconciler;
import com.andia.mixin.bekasi.Runextra;
import com.andia.mixin.bekasi.Runfactor;
import com.andia.mixin.bekasi.Runserver;
import com.andia.mixin.bekasi.RunserverException;
import com.andia.mixin.bekasi.Runspace;
import com.andia.mixin.bekasi.Runstack;
import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryException;
import com.andia.mixin.raung.RepositoryItem;
import com.andia.mixin.util.TimedLogger;

public abstract class BaseRunserver implements Runserver {

	public final static String EXTRAS = "extras";
	public final static String UNTITLES = "untitles";

	private static Logger logger = LoggerFactory.getLogger(BaseRunserver.class);

	private Enginery enginery;
	private Repository repository;
	private Reconciler reconciler;
	private Map<String, BaseRuns> map = new ConcurrentHashMap<>();

	private String folder;

	public BaseRunserver(String folder) {
		this.folder = folder;
	}

	@Inject
	public void setEnginery(Enginery enginery) {
		this.enginery = enginery;
	}

	@Inject
	public void setRepository(Repository repository) {
		this.repository = repository;
	}

	@Inject
	public void setReconciler(Reconciler reconciler) {
		this.reconciler = reconciler;
	}

	private synchronized BaseRuns getRuns(String space) throws RunserverException {

		if (map.containsKey(space)) {
			return map.get(space);
		}

		// Space
		UUID spaceId = null;
		if (repository.isRootItemExists(space)) {
			logger.debug("Space " + space + " already exists");
			RepositoryItem item = repository.loadRootItem(space);
			spaceId = item.getId();
		} else {
			try {
				logger.debug("Space folder " + space + " is missing and create");
				spaceId = repository.createRootFolder(space);
			} catch (RepositoryException e) {
				throw new RunserverException("Fail create space folder", e);
			}
		}

		// Runstack and runspace
		TimedLogger logger = new TimedLogger(BaseRunserver.logger);

		UUID folderId = prepareSpaceFolder(spaceId, folder);
		UUID extrasId = prepareSpaceFolder(spaceId, EXTRAS);
		UUID untitlesId = prepareSpaceFolder(spaceId, UNTITLES);
		Runfactor runfactor = new Runfactor(space, folderId, untitlesId, extrasId);
		registerCapabilities(runfactor);

		BaseRunextra runextra = createRunextra(repository, runfactor);
		BaseRunstack runstack = createRunstack(repository, reconciler, runfactor, enginery);
		BaseRunspace runspace = createRunspace(repository, runfactor, runstack);
		BaseRuns runs = new BaseRuns(runextra, runstack, runspace);
		logger.debugElapsedIn("Prepare runstack and runspace for space " + space);
		map.put(space, runs);
		return runs;
	}

	protected abstract void registerCapabilities(Runfactor runfactor);

	protected abstract BaseRunextra createRunextra(Repository repository, Runfactor runfactor);

	protected abstract BaseRunstack createRunstack(Repository repository,
			Reconciler reconciler, Runfactor runfactor, Enginery enginery);

	protected abstract BaseRunspace createRunspace(
			Repository repository, Runfactor runfactor, BaseRunstack runstack);

	private UUID prepareSpaceFolder(UUID spaceId, String name) throws RunserverException {
		if (repository.isItemExists(spaceId, name)) {
			RepositoryItem item = repository.loadItem(spaceId, name);
			return item.getId();
		} else {
			try {
				logger.debug("Folder " + name + " is missing and create");
				return repository.createFolder(spaceId, name);
			} catch (RepositoryException e) {
				throw new RunserverException("Fail prepare folder " + name, e);
			}
		}
	}

	@Override
	public Runspace getRunspace(String space) throws RunserverException {
		BaseRuns value = getRuns(space);
		if (value != null) {
			return value.getRunspace();
		}
		return null;
	}

	@Override
	public Runstack getRunstack(String space) throws RunserverException {
		BaseRuns value = getRuns(space);
		if (value != null) {
			return value.getRunstack();
		}
		return null;
	}

	@Override
	public Runextra getRunextra(String space) throws RunserverException {
		BaseRuns value = getRuns(space);
		if (value != null) {
			return value.getRunextra();
		}
		return null;
	}

	private static class BaseRuns {

		private BaseRunstack runstack;
		private BaseRunspace runspace;
		private BaseRunextra runextra;

		public BaseRuns(BaseRunextra runextra, BaseRunstack runstack, BaseRunspace runspace) {
			this.runextra = runextra;
			this.runstack = runstack;
			this.runspace = runspace;
		}

		public BaseRunextra getRunextra() {
			return runextra;
		}

		public Runstack getRunstack() {
			return runstack;
		}

		public Runspace getRunspace() {
			return runspace;
		}

	}

}
