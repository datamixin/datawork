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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.padang.dumai.anchors.InstructionAnchor;
import com.andia.mixin.rmo.BaseOutsetList;
import com.andia.mixin.rmo.Supervisor;

public class ProminerMutationOutsetList extends BaseOutsetList<ProminerMutationOutset> {

	private static Logger logger = LoggerFactory.getLogger(ProminerMutationOutsetList.class);

	private Supervisor supervisor;

	public ProminerMutationOutsetList(Supervisor supervisor) {
		this.supervisor = supervisor;
	}

	@Override
	public void move(ProminerMutationOutset child, int index) {
		int position = indexOf(child);
		try {
			super.move(child, index);
			Transformation transmutation = child.createTransformation();
			InstructionAnchor sequence = supervisor.getPreparedObject(InstructionAnchor.class);
			sequence.removeMutation(position);
			sequence.insertMutation(index, transmutation);
		} catch (Exception e) {
			logger.error("Fail set move mutation " + index, e);
		}
	}

}
