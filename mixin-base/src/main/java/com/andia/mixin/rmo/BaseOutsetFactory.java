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
package com.andia.mixin.rmo;

import java.lang.reflect.Constructor;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EReference;

public class BaseOutsetFactory implements OutsetFactory {

	protected Map<String, Class<? extends Outset>> outsets = new HashMap<>();

	protected void register(String className, Class<? extends Outset> outsetClass) {
		this.outsets.put(className, outsetClass);
	}

	protected void registerList(String className, EReference feature, Class<? extends Outset> outsetClass) {
		String key = asFeatureKey(className, feature);
		register(key, outsetClass);
	}

	@Override
	public String asFeatureKey(String className, EFeature feature) {
		return className + "." + feature.getName();
	}

	@Override
	public Outset create(Supervisor supervisor, String className) throws OutsetException {

		Class<? extends Outset> outsetClass = null;
		outsetClass = this.outsets.get(className);

		if (outsetClass != null) {

			try {

				// Cari apakah ada contructor dengan parameter supervisor
				Class<?>[] supervisorArgs = new Class<?>[] { Supervisor.class };
				Constructor<?> constructorWithSupervisor = null;
				Constructor<?>[] constructors = outsetClass.getConstructors();

				for (Constructor<?> constructor : constructors) {

					Class<?>[] parameterTypes = constructor.getParameterTypes();
					if (Arrays.deepEquals(parameterTypes, supervisorArgs)) {
						constructorWithSupervisor = constructor;
					}

				}

				if (constructorWithSupervisor != null) {

					// Buat outset dengan default no args constructor.
					Outset outset = (Outset) constructorWithSupervisor.newInstance(supervisor);
					return outset;

				} else {

					// Buat outset dengan supervisor arg constructor.
					Outset outset = outsetClass.newInstance();
					return outset;
				}

			} catch (Exception e) {
				String s = "Fail create outset " + outsetClass;
				throw new OutsetException(s, e);
			}
		} else {
			throw new OutsetException("Missing outset for " + className);
		}
	}

	@Override
	public boolean isExists(String className) {
		return outsets.containsKey(className);
	}
}
