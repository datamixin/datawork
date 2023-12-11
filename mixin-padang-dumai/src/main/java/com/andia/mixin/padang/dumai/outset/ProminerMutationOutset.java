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

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.visage.VisageError;
import com.andia.mixin.padang.dumai.ProminerTransmutation;
import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.padang.dumai.anchors.InstructionAnchor;
import com.andia.mixin.padang.dumai.anchors.SourceAnchor;
import com.andia.mixin.padang.dumai.anchors.TransmutationAnchor;
import com.andia.mixin.padang.outset.MutationOutset;
import com.andia.mixin.rmo.Invoke;
import com.andia.mixin.rmo.Lifetime;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;

public class ProminerMutationOutset implements MutationOutset, Lifetime {

	private static Logger logger = LoggerFactory.getLogger(ProminerMutationOutset.class);

	private Supervisor supervisor;
	private String operation;
	private InstructionAnchor instruction;
	private Map<String, SExpression> options = new LinkedHashMap<>();

	public ProminerMutationOutset(Supervisor supervisor) {
		this.supervisor = supervisor;
		assignInstructionAnchor();
		prepareTransmutationAnchor();
	}

	private void assignInstructionAnchor() {
		instruction = supervisor.getPreparedObject(InstructionAnchor.class);
	}

	private void prepareTransmutationAnchor() {
		supervisor.setPreparedObject(TransmutationAnchor.class, new MutationTransmutationAnchor());
	}

	@Override
	public void setOperation(String operation) {
		this.operation = operation;
	}

	@Invoke(ProminerOutset.INSPECT_RESULT)
	public Object inspectResult(String operation, Map<String, SExpression> arguments) {
		try {
			int index = getIndex();
			Transformation transmutation = new ProminerTransmutation(operation, arguments);
			if (instruction instanceof SourceAnchor) {
				SourceAnchor anchor = (SourceAnchor) instruction;
				Object value = anchor.selectMutationResult(index, transmutation);
				return value;
			} else {
				return new VisageError("Pipeline anchor is not a source");
			}
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	public Transformation createTransformation() {
		ProminerTransmutation transmutation = new ProminerTransmutation(operation);
		for (String name : options.keySet()) {
			SExpression value = options.get(name);
			transmutation.setOption(name, value);
		}
		return transmutation;
	}

	@Override
	public void initiate() {
	}

	@Override
	public void activate() {
		int index = getIndex();
		try {
			Transformation transmutation = createTransformation();
			instruction.insertMutation(index, transmutation);
		} catch (Exception e) {
			logger.error("Fail initiate mutation " + index, e);
		}
	}

	private int getIndex() {
		Supervisor parent = supervisor.getParent();
		int index = parent.indexOf(this);
		return index;
	}

	@Override
	public void terminate() {
		int index = getIndex();
		try {
			instruction.removeMutation(index);
		} catch (Exception e) {
			logger.error("Fail terminate mutation " + index, e);
		}
	}

	class MutationTransmutationAnchor implements TransmutationAnchor {

		@Override
		public void setOption(String name, SExpression value) {
			boolean existing = options.containsKey(name);
			options.put(name, value);
			int index = getIndex();
			if (existing) {
				try {
					instruction.removeMutation(index);
					Transformation transmutation = createTransformation();
					instruction.insertMutation(index, transmutation);
				} catch (Exception e) {
					logger.error("Fail set option mutation " + index, e);
				}
			}
		}

		@Override
		public void removeOption(String name) {
			options.remove(name);
		}

	}

}
