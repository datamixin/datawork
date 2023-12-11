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
package com.andia.mixin.padang.dumai.outset;

import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.padang.dumai.anchors.DisplayAnchor;
import com.andia.mixin.padang.dumai.anchors.InspectionAnchor;
import com.andia.mixin.padang.dumai.anchors.PreparationAnchor;
import com.andia.mixin.padang.outset.DisplayOutset;
import com.andia.mixin.rmo.Supervisor;

public abstract class ProminerDisplayOutset implements DisplayOutset {

	private Supervisor supervisor;
	private InspectionAnchor inspection;

	public ProminerDisplayOutset(Supervisor supervisor) {
		this.supervisor = supervisor;
		assignInspectionAnchor();
		prepareDisplayAnchor();
	}

	private void assignInspectionAnchor() {
		inspection = supervisor.getPreparedObject(InspectionAnchor.class);
	}

	private void prepareDisplayAnchor() {
		supervisor.setPreparedObject(PreparationAnchor.class, new ProminerDisplayAnchor());
	}

	class ProminerDisplayAnchor implements DisplayAnchor {

		@Override
		public void insertMutation(int index, Transformation transmutation) throws ProminerException {
			inspection.insertMutation(index, transmutation);
		}

		@Override
		public void removeMutation(int index) throws ProminerException {
			inspection.removeMutation(index);
		}

	}

}
