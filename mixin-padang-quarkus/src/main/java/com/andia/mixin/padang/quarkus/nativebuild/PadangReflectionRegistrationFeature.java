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
package com.andia.mixin.padang.quarkus.nativebuild;

import com.andia.mixin.bekasi.quarkus.nativebuild.BaseReflectionRegistrationFeature;
import com.oracle.svm.core.annotate.AutomaticFeature;

@AutomaticFeature
public class PadangReflectionRegistrationFeature extends BaseReflectionRegistrationFeature {

	@Override
	public void beforeAnalysis(BeforeAnalysisAccess access) {

		super.beforeAnalysis(access);
		try {

			System.out.println("Padang instantiable reflection classes:");
			registerInstantiables(

			);

			System.out.println("Padang service provider reflection classes:");
			registerServiceProviders();

		} catch (Exception e) {
			throw new RuntimeException(e);
		} finally {
			System.out.println("Padang discovery complete!");
		}

	}

}
