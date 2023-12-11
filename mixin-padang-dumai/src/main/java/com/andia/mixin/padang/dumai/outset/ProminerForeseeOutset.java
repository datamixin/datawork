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

import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_EVALUATE;

import com.andia.mixin.bekasi.visage.VisageError;
import com.andia.mixin.padang.dumai.anchors.SheetAnchor;
import com.andia.mixin.padang.outset.ForeseeOutset;
import com.andia.mixin.rmo.Invoke;
import com.andia.mixin.rmo.Lifetime;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.model.XExpression;

public abstract class ProminerForeseeOutset implements ForeseeOutset, Lifetime {

	protected Supervisor supervisor;
	protected SheetAnchor sheet;

	public ProminerForeseeOutset(Supervisor supervisor) {
		this.supervisor = supervisor;
		assignSheetAnchor();
	}

	private void assignSheetAnchor() {
		sheet = supervisor.getPreparedObject(SheetAnchor.class);
	}

	@Override
	public void activate() {

	}

	@Invoke(INSPECT_EVALUATE)
	public Object inspectEvaluate(XExpression expression) {
		try {
			Object value = sheet.evaluateOnForesee(expression);
			return value;
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	@Override
	public void terminate() {

	}

}
