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
package com.andia.mixin.model;

public class MNode extends BasicEObject {

	public static String XCLASSNAME = Mock.getEClassName("MNode");

	public static EAttribute FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
	public static EReference FEATURE_STATE = new EReference("state", MValue.class);
	public static EReference FEATURE_FACET = new EReference("facet", MFacet.class);
	public static EReference FEATURE_STYLES = new EReference("styles", MValue.class);

	private String name = null;
	private MValue state = null;
	private MFacet facet = null;
	private EMap<MValue> styles = new BasicEMap<>(this, FEATURE_STYLES);

	public MNode() {
		super(Mock.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_NAME,
				FEATURE_STATE,
				FEATURE_FACET,
				FEATURE_STYLES
		});
	}

	public String getName() {
		return name;
	}

	public void setName(String newName) {
		String oldName = this.name;
		this.name = newName;
		this.eSetNotify(FEATURE_NAME, oldName, newName);
	}

	public MValue getState() {
		return state;
	}

	public void setState(MValue newState) {
		MValue oldState = this.state;
		this.state = newState;
		this.eSetNotify(FEATURE_STATE, oldState, newState);
	}

	public EMap<MValue> getStyles() {
		return styles;
	}

	public MFacet getFacet() {
		return facet;
	}

	public void setFacet(MFacet newFacet) {
		MFacet oldFacet = this.facet;
		this.facet = newFacet;
		this.eSetNotify(FEATURE_FACET, oldFacet, newFacet);
	}

}
