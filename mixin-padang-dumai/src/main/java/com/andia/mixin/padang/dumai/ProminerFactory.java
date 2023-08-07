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

import java.util.ServiceLoader;
import java.util.UUID;

import javax.enterprise.context.ApplicationScoped;

import com.andia.mixin.Options;
import com.andia.mixin.plan.QualifiedPlan;

@ApplicationScoped
public class ProminerFactory {

	private static ProminerFactory instance;
	private QualifiedPlan plan;

	private ProminerFactory() {
		loadProminers();
	}

	private void loadProminers() {
		ServiceLoader<ProminerRegistration> loader = ServiceLoader.load(ProminerRegistration.class);
		for (ProminerRegistration registration : loader) {
			QualifiedPlan plan = registration.getProminerPlan();
			register(plan);
		}
	}

	public static ProminerFactory getInstance() {
		if (instance == null) {
			instance = new ProminerFactory();
		}
		return instance;
	}

	public void register(QualifiedPlan plan) {
		this.plan = plan;
	}

	public Prominer create(String space, UUID fileId, Options options) throws ProminerException {
		Class<?> instanceClass = this.plan.getQualifiedClass();
		try {
			Prominer prominer = (Prominer) instanceClass.newInstance();
			prominer.init(space, fileId, options);
			return prominer;
		} catch (InstantiationException | IllegalAccessException e) {
			throw new ProminerException("Fail create " + instanceClass, e);
		}
	}

}
