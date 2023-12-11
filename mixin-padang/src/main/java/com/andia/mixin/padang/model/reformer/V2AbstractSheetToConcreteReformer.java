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
package com.andia.mixin.padang.model.reformer;

import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

public class V2AbstractSheetToConcreteReformer extends PadangReformer {

	private static final String XDATASET = "XDataset";
	private static final String XVIEWSET = "XViewset";
	private static final String NAME = "name";
	private static final String FORESEE = "foresee";
	private static final String SOURCE = "source";
	private static final String DISPLAY = "display";
	private static final String RESERVE = "reserve";
	private static final String PROPERTIES = "properties";
	private static final String PART = "part";
	private static final String SELECTION = "selection";

	@Override
	public int getVersion() {
		return 2;
	}

	@Override
	public void reform(JsonObject input, JsonObjectBuilder builder) {
		modifyObject(input, builder,
				(original) -> {
					boolean isDataset = hasEClass(original, XDATASET);
					boolean isViewset = hasEClass(original, XVIEWSET);
					return isDataset || isViewset;
				},
				(original, replacement) -> {

					// Copy dataset name
					addCopyValue(replacement, original, NAME);

					JsonObjectBuilder foresee = createEmptyObject();
					boolean isDataset = hasEClass(original, XDATASET);
					boolean isViewset = hasEClass(original, XVIEWSET);
					if (isDataset) {

						// Create dataset foresee
						String eClassType = getEClassType(XDATASET);
						foresee.add(ECLASS, eClassType);

						// Copy from original
						addCopyValue(foresee, original, SOURCE);
						addCopyValue(foresee, original, DISPLAY);
						addCopyValue(foresee, original, RESERVE);
						addCopyValue(foresee, original, PROPERTIES);

					} else if (isViewset) {

						// Create dataset foresee
						String eClassType = getEClassType(XVIEWSET);
						foresee.add(ECLASS, eClassType);

						// Copy from original
						addCopyValue(foresee, original, PART);
						addCopyValue(foresee, original, SELECTION);
					}

					// Add dataset foresee
					replacement.add(FORESEE, foresee);

				});

	}

}
