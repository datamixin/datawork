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
package com.andia.mixin.bekasi.pagar;

import java.util.LinkedHashMap;
import java.util.Map;

import com.andia.mixin.bekasi.webface.ExtensionRegistration;

public class PagarExtensionRegistration implements ExtensionRegistration {

	@Override
	public int getPriority() {
		return 1;
	}

	@Override
	public Map<String, String> getScripts() {
		Map<String, String> styles = new LinkedHashMap<>();
		styles.put("pagar-lib", "/bekasi/bekasi-pagar-lib.js");
		styles.put("pagar-main", "/bekasi/bekasi-pagar-main.js");
		return styles;
	}

	@Override
	public Map<String, String> getStyles() {
		Map<String, String> scripts = new LinkedHashMap<>();
		scripts.put("pagar", "/bekasi/bekasi-pagar.css");
		return scripts;
	}

}
