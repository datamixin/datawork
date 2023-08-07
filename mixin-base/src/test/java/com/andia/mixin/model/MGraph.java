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

public class MGraph extends BasicEObject {

	public static String XCLASSNAME = Mock.getEClassName("MGraph");

	public static EAttribute FEATURE_TYPE = new EAttribute("type", EAttribute.STRING);
	public static EReference FEATURE_MARK = new EReference("mark", MValue.class);
	public static EReference FEATURE_NODES = new EReference("nodes", MNode.class);
	public static EReference FEATURE_EDGES = new EReference("edges", MEdge.class);

	private String type = null;
	private MValue mark = null;
	private EList<MNode> nodes = new BasicEList<>(this, FEATURE_NODES);
	private EList<MEdge> edges = new BasicEList<>(this, FEATURE_EDGES);

	public MGraph() {

		super(Mock.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_TYPE,
				FEATURE_MARK,
				FEATURE_NODES,
				FEATURE_EDGES,
		});
	}

	public EList<MNode> getNodes() {
		return nodes;
	}

	public EList<MEdge> getEdges() {
		return edges;
	}

	public String getType() {
		return type;
	}

	public void setType(String newType) {
		String oldType = this.type;
		this.type = newType;
		this.eSetNotify(FEATURE_TYPE, oldType, newType);
	}

	public MValue getMark() {
		return mark;
	}

	public void setMark(MValue newMark) {
		MValue oldMark = this.mark;
		this.mark = newMark;
		this.eSetNotify(FEATURE_MARK, oldMark, newMark);
	}

}
