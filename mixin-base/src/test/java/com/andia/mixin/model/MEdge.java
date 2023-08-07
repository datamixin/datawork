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
package com.andia.mixin.model;

public class MEdge extends BasicEObject {

	public static String XCLASSNAME = Mock.getEClassName("MEdge");

	public static EAttribute FEATURE_SOURCE = new EAttribute("source", EAttribute.STRING);
	public static EAttribute FEATURE_TARGET = new EAttribute("target", EAttribute.STRING);
	public static EReference FEATURE_PROPERTIES = new EReference("properties", MValue.class);

	private String source = null;
	private String target = null;
	private EMap<MValue> properties = new BasicEMap<>(this, FEATURE_PROPERTIES);

	public MEdge() {
		super(Mock.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_SOURCE,
				FEATURE_TARGET,
				FEATURE_PROPERTIES
		});
	}

	public String getSource() {
		return source;
	}

	public void setSource(String newSource) {
		String oldSource = this.source;
		this.source = newSource;
		this.eSetNotify(FEATURE_SOURCE, oldSource, newSource);
	}

	public String getTarget() {
		return target;
	}

	public void setTarget(String newTarget) {
		String oldTarget = this.target;
		this.target = newTarget;
		this.eSetNotify(FEATURE_TARGET, oldTarget, newTarget);
	}

	public EMap<MValue> getProperties() {
		return properties;
	}

}
