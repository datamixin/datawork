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
package com.andia.mixin.sleman.util;

import static java.lang.Integer.toHexString;

import java.util.Arrays;
import java.util.List;

import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EObject;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.XExpression;

public class FeatureCode {

	private XExpression expression;

	public FeatureCode(SExpression expression) {
		this.expression = (XExpression) expression;
	}

	public String generate() {

		EObject current = expression;
		StringBuffer buffer = new StringBuffer();
		while (current != null) {

			EFeature feature = current.eContainingFeature();
			EObject container = current.eContainer();
			if (container != null) {

				Object value = container.eGet(feature);
				if (value instanceof EList) {
					EList<?> list = (EList<?>) value;
					encodeElement(buffer, list, current, true);
				}

				EFeature[] features = container.eFeatures();
				List<EFeature> list = Arrays.asList(features);
				encodeElement(buffer, list, feature, false);
			}
			current = container;
		}
		return buffer.toString();
	}

	private void encodeElement(StringBuffer buffer, List<?> list, EFeature element, boolean flag) {
		int index = list.indexOf(element);
		encodeIndex(buffer, index, flag);
	}

	private void encodeElement(StringBuffer buffer, EList<?> list, Object element, boolean flag) {
		int index = list.indexOf(element);
		encodeIndex(buffer, index, flag);
	}

	private void encodeIndex(StringBuffer buffer, int index, boolean flag) {
		String hex = toHexString(index);
		buffer.insert(0, hex);
		if (flag) {
			int length = hex.length();
			String lengthHex = toHexString(length);
			buffer.insert(0, lengthHex);
		}
	}

}
