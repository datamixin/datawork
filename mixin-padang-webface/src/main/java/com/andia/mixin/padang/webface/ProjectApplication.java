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
package com.andia.mixin.padang.webface;

import java.util.LinkedHashMap;
import java.util.Map;

import com.andia.mixin.bekasi.webface.Application;

public class ProjectApplication implements Application {

	@Override
	public String getName() {
		return "Project";
	}

	@Override
	public Map<String, String> getScripts() {
		Map<String, String> scripts = new LinkedHashMap<>();
		scripts.put("main", "../padang/padang-main.js");
		ResourceRegistry registry = ResourceRegistry.getInstance();
		Map<String, String> map = registry.getScripts();
		scripts.putAll(map);
		return scripts;
	}

	@Override
	public Map<String, String> getStyles() {
		Map<String, String> styles = new LinkedHashMap<>();
		styles.put("main", "../padang/padang-main.css");
		ResourceRegistry registry = ResourceRegistry.getInstance();
		Map<String, String> map = registry.getStyles();
		styles.putAll(map);
		return styles;
	}

}
