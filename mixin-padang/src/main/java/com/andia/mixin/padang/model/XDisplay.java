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
package com.andia.mixin.padang.model;

import com.andia.mixin.model.BasicEList;
import com.andia.mixin.model.BasicEMap;
import com.andia.mixin.model.BasicEObject;
import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EClass;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EMap;
import com.andia.mixin.model.EReference;
import com.andia.mixin.util.ArrayUtils;

public abstract class XDisplay extends BasicEObject {

	public static EReference FEATURE_MUTATIONS = new EReference("mutations", XMutation.class);
	public static EAttribute FEATURE_PROPERTIES = new EAttribute("properties", EAttribute.STRING);

	private EList<XMutation> mutations = new BasicEList<XMutation>(this, XDisplay.FEATURE_MUTATIONS);
	private EMap<String> properties = new BasicEMap<String>(this, XFacet.FEATURE_PROPERTIES);

	public XDisplay(EClass xClass, EFeature[] features) {
		super(xClass, ArrayUtils.push(features, new EFeature[] {
				XDisplay.FEATURE_MUTATIONS,
				XDisplay.FEATURE_PROPERTIES
		}));
	}

	public EList<XMutation> getMutations() {
		return mutations;
	}

	public EMap<String> getProperties() {
		return properties;
	}

}
