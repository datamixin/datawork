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
package com.andia.mixin;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface Options {

	public Collection<String> getNames();

	public boolean containsName(String name);

	public Object getValue(String name);

	public String getString(String name);

	public Boolean getBoolean(String name);

	public Integer getInteger(String name);

	public Float getFloat(String name);

	public <T> List<T> getList(String name);

	public <T> Map<String, T> getMap(String name);

}
