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
package com.andia.mixin.rmo;

import java.util.function.Function;

public class OutsetInvoker implements Function<Regulator, Object> {

	private FeatureCall call;

	public OutsetInvoker(FeatureCall call) {
		this.call = call;
	}

	public Object invoke(Regulator regulator) throws OutsetException {
		FeaturePath path = call.getPath();
		RegulatorVisitor visitor = new RegulatorVisitor(path, this);
		return visitor.visit(regulator);
	}

	@Override
	public Object apply(Regulator regulator) throws OutsetException {

		String name = call.getName();
		Object[] arguments = call.getArguments();
		Outset outset = regulator.getOutset();
		InvokeIgniter igniter = new InvokeIgniter(outset);
		try {
			return igniter.ignite(name, arguments);
		} catch (InvokeIgniterException e) {
			throw new OutsetException("Fail inspect outset", e);
		}
	}

}
