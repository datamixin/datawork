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
package com.andia.mixin.padang.base;

import com.andia.mixin.bekasi.Runfactor;
import com.andia.mixin.bekasi.base.BaseRunextra;
import com.andia.mixin.model.EObject;
import com.andia.mixin.model.EObjectSerde;
import com.andia.mixin.model.EPackage;
import com.andia.mixin.padang.ProjectRunextra;
import com.andia.mixin.padang.model.PadangPackage;
import com.andia.mixin.padang.model.XMutation;
import com.andia.mixin.raung.Repository;

public class BaseProjectRunextra extends BaseRunextra implements ProjectRunextra {

	public BaseProjectRunextra(Repository repository, Runfactor runfactor) {
		super(repository, runfactor);
	}

	@Override
	protected EObjectSerde<EObject> createSerde() {
		EPackage packages = PadangPackage.eINSTANCE;
		EObjectSerde<EObject> serde = new EObjectSerde<>(packages);
		return serde;
	}

	@Override
	protected boolean isTypeMatch(EObject model, String type) {
		XMutation mutation = (XMutation) model;
		String operation = mutation.getOperation();
		return operation.equals(type);
	}

}
