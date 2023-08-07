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

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.ServiceLoader;

public class ApplicationRegistry {

	private static ApplicationRegistry instance;

	private Map<String, Map<String, String>> scripts = new HashMap<>();
	private Map<String, Map<String, String>> styles = new HashMap<>();

	private ApplicationRegistry() {
		loadApplications();
	}

	public static ApplicationRegistry getInstance() {
		if (instance == null) {
			instance = new ApplicationRegistry();
		}
		return instance;
	}

	private void loadApplications() {
		ServiceLoader<ApplicationRegistration> loader = ServiceLoader.load(ApplicationRegistration.class);
		for (ApplicationRegistration registration : loader) {
			Application application = registration.getApplication();
			register(application);
		}
	}

	private void register(Application application) {

		String name = application.getName();
		scripts.put(name, new LinkedHashMap<>());
		Map<String, String> scriptMap = scripts.get(name);
		Map<String, String> appScripts = application.getScripts();
		for (String key : appScripts.keySet()) {
			String script = appScripts.get(key);
			scriptMap.put(key, script);
		}

		styles.put(name, new LinkedHashMap<>());
		Map<String, String> styleMap = styles.get(name);
		Map<String, String> appStyles = application.getStyles();
		for (String key : appStyles.keySet()) {
			String style = appStyles.get(key);
			styleMap.put(key, style);
		}
	}

	public Map<String, Map<String, String>> getScripts() {
		return scripts;
	}

	public Map<String, Map<String, String>> getStyles() {
		return styles;
	}

}
