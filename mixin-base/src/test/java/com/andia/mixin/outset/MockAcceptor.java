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
package com.andia.mixin.outset;

import java.util.List;

import com.andia.mixin.model.Notification;
import com.andia.mixin.rmo.Acceptor;
import com.andia.mixin.rmo.FeaturePath;
import com.andia.mixin.rmo.Modification;
import com.andia.mixin.rmo.Rectification;

public class MockAcceptor implements Acceptor {

	@Override
	public void accept(Rectification progress, List<Modification> pool) {
		FeaturePath featurePath = new FeaturePath();
		Modification modification = new Modification(featurePath, Notification.SET);
		pool.add(modification);
	}

}
