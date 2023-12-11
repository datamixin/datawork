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
package com.andia.mixin.padang.malang;

import java.util.LinkedHashMap;
import java.util.Map;

import com.andia.mixin.padang.webface.ResourceRegistration;

public class MalangResourceRegistration implements ResourceRegistration {

	@Override
	public int getPriority() {
		return 12;
	}

	@Override
	public Map<String, String> getScripts() {
		Map<String, String> styles = new LinkedHashMap<>();
		styles.put("malang-lib", "../padang/padang-malang-lib.js");
		styles.put("malang-main", "../padang/padang-malang-main.js");
		return styles;
	}

	@Override
	public Map<String, String> getStyles() {
		Map<String, String> scripts = new LinkedHashMap<>();
		scripts.put("malang", "../padang/padang-malang.css");
		return scripts;
	}

}
