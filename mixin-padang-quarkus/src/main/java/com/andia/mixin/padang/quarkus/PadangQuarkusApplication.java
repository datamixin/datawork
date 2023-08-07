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
package com.andia.mixin.padang.quarkus;

import java.util.Optional;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.quarkus.QuarkusUtils;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.QuarkusApplication;

public class PadangQuarkusApplication implements QuarkusApplication {

	private final static String FILTER_USER_ID = "filter.user.id";
	private final static String FILTER_SESSION_ID = "filter.session.id";
	private final static String DERBY_SYSTEM_HOME = "derby.system.home";
	private final static String WORKSPACE_LOGOUT_URL = "workspace.logout.url";

	private static Logger logger = LoggerFactory.getLogger(PadangQuarkusApplication.class);

	@ConfigProperty(name = "secret.key")
	protected Optional<String> secretKey;

	@ConfigProperty(name = PadangQuarkusApplication.FILTER_USER_ID)
	protected Optional<String> filterUserId;

	@ConfigProperty(name = PadangQuarkusApplication.FILTER_SESSION_ID)
	protected Optional<String> filterSessionId;

	@ConfigProperty(name = PadangQuarkusApplication.DERBY_SYSTEM_HOME)
	protected Optional<String> derbySystemHome;

	@ConfigProperty(name = PadangQuarkusApplication.WORKSPACE_LOGOUT_URL)
	protected Optional<String> workspaceLogoutUrl;

	@Override
	public int run(String... params) throws Exception {

		// Defining default for key parameter.
		String keyParam = null;
		if (params.length > 0) {
			keyParam = params[0];
		}

		setProperty(PadangQuarkusApplication.FILTER_USER_ID, this.filterUserId);
		setProperty(PadangQuarkusApplication.FILTER_SESSION_ID, this.filterSessionId);
		setProperty(PadangQuarkusApplication.DERBY_SYSTEM_HOME, this.derbySystemHome);
		setProperty(PadangQuarkusApplication.WORKSPACE_LOGOUT_URL, this.workspaceLogoutUrl);

		String secretKey = this.secretKey.orElse(null);

		if (QuarkusUtils.isDesktopProfile()) {

			boolean isVerified = false;
			if (QuarkusUtils.isVerify(keyParam, secretKey)) {
				logger.info("Success verify for key: " + keyParam);
				isVerified = true;
			}

			if (isVerified) {
				Quarkus.waitForExit();
			}

		} else {
			logger.info("Quarkus application started");
			Quarkus.waitForExit();
		}
		return 0;
	}

	private void setProperty(String key, Optional<String> optional) {
		String value = optional.orElse(null);
		if (value != null) {
			System.setProperty(key, value);
		}
	}

}
