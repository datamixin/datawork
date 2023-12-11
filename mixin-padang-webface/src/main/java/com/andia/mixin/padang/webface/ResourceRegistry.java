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
import java.util.ServiceLoader;
import java.util.TreeMap;

public class ResourceRegistry {

	private static ResourceRegistry instance;

	private Map<Integer, ResourceRegistration> registrations = new TreeMap<>();

	private ResourceRegistry() {
		loadResource();
	}

	public static ResourceRegistry getInstance() {
		if (instance == null) {
			instance = new ResourceRegistry();
		}
		return instance;
	}

	private void loadResource() {
		ServiceLoader<ResourceRegistration> loader = ServiceLoader.load(ResourceRegistration.class);
		for (ResourceRegistration registration : loader) {
			int priority = registration.getPriority();
			registrations.put(priority, registration);
		}
	}

	public Map<String, String> getStyles() {
		Map<String, String> map = new LinkedHashMap<>();
		for (Integer priority : registrations.keySet()) {
			ResourceRegistration registration = registrations.get(priority);
			Map<String, String> styles = registration.getStyles();
			for (String name : styles.keySet()) {
				String style = styles.get(name);
				map.put(name, style);
			}
		}
		return map;
	}

	public Map<String, String> getScripts() {
		Map<String, String> map = new LinkedHashMap<>();
		for (Integer priority : registrations.keySet()) {
			ResourceRegistration registration = registrations.get(priority);
			Map<String, String> scripts = registration.getScripts();
			for (String name : scripts.keySet()) {
				String script = scripts.get(name);
				map.put(name, script);
			}
		}
		return map;
	}

}
