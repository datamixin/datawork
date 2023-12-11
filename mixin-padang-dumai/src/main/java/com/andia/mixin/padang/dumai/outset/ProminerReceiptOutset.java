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

import static com.andia.mixin.padang.dumai.outset.ProminerOutset.INSPECT_COMPUTE;

import com.andia.mixin.bekasi.visage.VisageError;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.anchors.ReceiptAnchor;
import com.andia.mixin.padang.outset.ReceiptOutset;
import com.andia.mixin.rmo.Invoke;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;

public abstract class ProminerReceiptOutset extends ProminerForeseeOutset implements ReceiptOutset {

	public ProminerReceiptOutset(Supervisor supervisor) {
		super(supervisor);
		prepareReceiptAnchor();
	}

	private void prepareReceiptAnchor() {
		supervisor.setPreparedObject(ReceiptAnchor.class, new ProminerReceiptAnchor());
	}

	@Invoke(INSPECT_COMPUTE)
	public Object inspectCompute() {
		try {
			Object value = sheet.computeReceipt();
			return value;
		} catch (Exception e) {
			return new VisageError(e);
		}
	}

	class ProminerReceiptAnchor implements ReceiptAnchor {

		@Override
		public void assignInput(String input, SExpression value) throws ProminerException {
			sheet.assignReceiptInput(input, value);
		}

		@Override
		public void renameInput(String oldName, String newName) throws ProminerException {
			sheet.renameReceiptInput(oldName, newName);
		}

		@Override
		public void removeInput(String input) throws ProminerException {
			sheet.removeReceiptInput(input);
		}

	}

}
