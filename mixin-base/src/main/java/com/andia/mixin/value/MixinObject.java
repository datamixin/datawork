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
package com.andia.mixin.value;

import java.util.Collection;

public interface MixinObject extends MixinValue {

	public Collection<String> fieldNames();

	public boolean isExists(String field);

	public int fieldCount();

	public Object get(String field);

	public String getString(String field);

	public Integer getInteger(String field);

	public Float getFloat(String field);

	public Boolean getBoolean(String field);

	public MixinList getList(String field);

	public MixinArray getArray(String field);

	public MixinObject getObject(String field);

}
