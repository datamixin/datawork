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

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Named;

import com.andia.mixin.bekasi.Enginery;
import com.andia.mixin.bekasi.Reconciler;
import com.andia.mixin.bekasi.Runfactor;
import com.andia.mixin.bekasi.RunserverException;
import com.andia.mixin.bekasi.base.BaseRunextra;
import com.andia.mixin.bekasi.base.BaseRunserver;
import com.andia.mixin.bekasi.base.BaseRunstack;
import com.andia.mixin.padang.Project;
import com.andia.mixin.padang.ProjectRunextra;
import com.andia.mixin.padang.ProjectRunserver;
import com.andia.mixin.padang.ProjectRunspace;
import com.andia.mixin.padang.ProjectRunstack;
import com.andia.mixin.raung.Repository;

@ApplicationScoped
@Named(Project.PROJECTS)
public class BaseProjectRunserver extends BaseRunserver implements ProjectRunserver {

	public BaseProjectRunserver() {
		super(Project.PROJECTS);
	}

	@Override
	protected void registerCapabilities(Runfactor runfactor) {

	}

	@Override
	protected BaseProjectRunspace createRunspace(
			Repository repository, Runfactor runfactor, BaseRunstack runstack) {
		return new BaseProjectRunspace(repository, runfactor, runstack);
	}

	@Override
	protected BaseProjectRunstack createRunstack(Repository repository,
			Reconciler reconciler, Runfactor runfactor, Enginery machinery) {
		return new BaseProjectRunstack(repository, reconciler, runfactor, machinery);
	}

	@Override
	protected BaseRunextra createRunextra(Repository repository, Runfactor runfactor) {
		return new BaseProjectRunextra(repository, runfactor);
	}

	@Override
	public ProjectRunspace getRunspace(String space) throws RunserverException {
		return (ProjectRunspace) super.getRunspace(space);
	}

	@Override
	public ProjectRunstack getRunstack(String space) throws RunserverException {
		return (ProjectRunstack) super.getRunstack(space);
	}

	@Override
	public ProjectRunextra getRunextra(String space) throws RunserverException {
		return (ProjectRunextra) super.getRunextra(space);
	}

}
