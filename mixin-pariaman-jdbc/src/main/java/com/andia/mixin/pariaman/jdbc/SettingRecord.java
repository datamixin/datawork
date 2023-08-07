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
package com.andia.mixin.pariaman.jdbc;

import com.andia.mixin.jepara.Column;
import com.andia.mixin.jepara.Record;

public class SettingRecord implements Record {

	public static final String SETTING = "setting";

	public static final String USER_SPACE = "user_space";
	public static final String PREF_KEY = "pref_key";
	public static final String PREF_VALUE = "pref_value";

	@Column(name = USER_SPACE)
	private String userSpace;

	@Column(name = PREF_KEY)
	private String prefKey;
	
	@Column(name = PREF_VALUE)
	private String prefValue;

	public String getUserSpace() {
		return userSpace;
	}

	public String getPrefKey() {
		return prefKey;
	}

	public String getPrevValue() {
		return prefValue;
	}

}
