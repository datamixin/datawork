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

import com.andia.mixin.bekasi.Runfactor;
import com.andia.mixin.bekasi.RunspaceRectifier;
import com.andia.mixin.bekasi.base.BaseRunspace;
import com.andia.mixin.padang.ProjectRunspace;
import com.andia.mixin.raung.Repository;

public class BaseProjectRunspace extends BaseRunspace implements ProjectRunspace {

	public BaseProjectRunspace(Repository repository, Runfactor runfactor, RunspaceRectifier rectifier) {
		super(repository, runfactor, rectifier);
	}

}
