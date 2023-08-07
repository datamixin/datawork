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
package com.andia.mixin.padang.dumai;

import java.util.UUID;

import javax.enterprise.context.ApplicationScoped;

import com.andia.mixin.Options;
import com.andia.mixin.base.MapOptions;
import com.andia.mixin.bekasi.Enginery;
import com.andia.mixin.bekasi.EngineryException;
import com.andia.mixin.bekasi.Lifestage;
import com.andia.mixin.padang.dumai.outset.ProminerOutsetFactory;
import com.andia.mixin.rmo.OutsetFactory;
import com.andia.mixin.rmo.Runmodel;

@ApplicationScoped
public class ProminerEnginery implements Enginery {

	@Override
	public OutsetFactory createOutsetFactory() {
		return new ProminerOutsetFactory();
	}

	@Override
	public void installCapabilities(Runmodel runmodel, Lifestage lifestage) throws EngineryException {
		registerProminer(runmodel, lifestage);
	}

	private void registerProminer(Runmodel runmodel, Lifestage lifestage) throws EngineryException {
		ProminerFactory factory = ProminerFactory.getInstance();
		String space = lifestage.getSpace();
		UUID fileId = lifestage.getFileId();
		Options options = new MapOptions();
		try {
			Prominer prosote = factory.create(space, fileId, options);
			runmodel.registerCapability(Prominer.class, prosote);
		} catch (Exception e) {
			throw new EngineryException("Fail create data store", e);
		}
	}

}
