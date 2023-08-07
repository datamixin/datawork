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
package com.andia.mixin.bekasi.webface;

import javax.inject.Inject;

import com.andia.mixin.bekasi.Runserver;
import com.andia.mixin.bekasi.RunserverException;
import com.andia.mixin.bekasi.Runstack;
import com.andia.mixin.lawang.SecuritySetting;

public class RestFileExport {

	public static final String FORMATS = "formats";
	public static final String DOWNLOAD = "download";

	protected Runserver runserver;
	protected Runstack runstack;

	@Inject
	public void setSecuritySetting(SecuritySetting setting) throws RunserverException {
		String stack = setting.getUserId();
		runstack = runserver.getRunstack(stack);
	}

}
