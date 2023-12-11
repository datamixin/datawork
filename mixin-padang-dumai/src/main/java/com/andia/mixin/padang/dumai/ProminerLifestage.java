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
package com.andia.mixin.padang.dumai;

import java.util.UUID;

import com.andia.mixin.bekasi.Lifestage;
import com.andia.mixin.rmo.Supervisor;

public class ProminerLifestage {

	private Supervisor supervisor;

	public ProminerLifestage(Supervisor supervisor) {
		this.supervisor = supervisor;
	}

	public Lifestage getFilestate() {
		return supervisor.getCapability(Lifestage.class);
	}

	public UUID getFileId() {
		Lifestage filestate = getFilestate();
		UUID fileId = filestate.getFileId();
		return fileId;
	}

	public String getSpace() {
		Lifestage lifestage = getFilestate();
		String space = lifestage.getSpace();
		return space;
	}

}
