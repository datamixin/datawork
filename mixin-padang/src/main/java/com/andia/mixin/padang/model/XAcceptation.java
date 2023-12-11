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
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EReference;

public class XAcceptation extends XSource {

	public static String XCLASSNAME = Padang.getEClassName("XAttribution");

	public static EReference FEATURE_ANNOTATIONS = new EReference("annotations", XAnnotation.class);

	private EList<XAnnotation> annotationss = new BasicEList<XAnnotation>(this, XProject.FEATURE_SHEETS);

	public XAcceptation() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XProject.FEATURE_SHEETS,
		});
	}

	public EList<XAnnotation> getAnnotations() {
		return this.annotationss;
	}

}
