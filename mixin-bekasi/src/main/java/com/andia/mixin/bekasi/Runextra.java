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
package com.andia.mixin.bekasi;

import java.util.Collection;

import com.andia.mixin.model.EObject;

public interface Runextra {

	public EObject loadModel(String group, String name) throws RunextraException;

	public void saveModel(String group, String name, EObject model) throws RunextraException;

	public void removeModel(String group, String name) throws RunextraException;

	public Collection<String> getNames(String group) throws RunextraException;

	public Collection<String> getNamesByType(String group, String type) throws RunextraException;

}
