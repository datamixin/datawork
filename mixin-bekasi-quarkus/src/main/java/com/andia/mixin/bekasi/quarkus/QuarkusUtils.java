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
package com.andia.mixin.bekasi.quarkus;

import com.andia.mixin.util.UUIDUtils;

import io.quarkus.runtime.configuration.ProfileManager;

public class QuarkusUtils {

	public static String DESKTOP_PROFILE = "desktop";
	public static String TEST_DESKTOP_PROFILE = "testdesktop";

	private QuarkusUtils() {
	}

	public static boolean isDesktopProfile() {
		String activeProfile = ProfileManager.getActiveProfile();
		boolean isDesktopProfile = activeProfile.equals(DESKTOP_PROFILE);
		return isDesktopProfile;
	}

	public static boolean isProfile(String profile) {
		String activeProfile = ProfileManager.getActiveProfile();
		return activeProfile.equals(profile);
	}

	public static boolean isVerify(String keyParam, String secretKey) {
		try {
			String decrypt = CryptUtils.decrypt(keyParam, secretKey);
			return UUIDUtils.isUUID(decrypt);
		} catch (Exception e) {
			return false;
		}
	}

}
