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

import java.util.Collection;
import java.util.function.Consumer;
import java.util.function.Function;

import com.andia.mixin.Lean;

public interface Supervisor {

	public Supervisor getParent();

	public <T extends Outset> int indexOf(T outset);

	public String getQualifiedPath();

	public FeatureKey[] getFeatureKeys();

	public void submit(Rectification rectification);

	public void submitIndication(String key, Lean... values);

	public <P> void setPreparedObject(Class<? extends P> preparedClass, P p);

	public <P> P getPreparedObject(Class<? extends P> preparedClass);

	public <C> C getCapability(Class<? extends C> capabilityClass);

	public <D> void applyDescendants(Class<? extends D> descendantClass, Consumer<D> consumer);

	public <D> D getFirstDescendant(Class<? extends D> descendantClass, Function<D, Boolean> evaluator);

	public <D> Collection<D> getDescendants(Class<? extends D> descendantClass, Function<D, Boolean> evaluator);

	public <D> void applyFirstDescendant(Class<? extends D> descendantClass,
			Function<D, Boolean> evaluator, Consumer<D> consumer);

}
