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
package com.andia.mixin.sleman.base;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EMap;
import com.andia.mixin.model.EObject;
import com.andia.mixin.model.EUtils;
import com.andia.mixin.sleman.api.ExpressionFactory;
import com.andia.mixin.sleman.api.ExpressionHelper;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.api.SIdentifier;
import com.andia.mixin.sleman.api.SReference;
import com.andia.mixin.sleman.model.XAssignment;
import com.andia.mixin.sleman.model.XExpression;

public class BaseExpressionHelper implements ExpressionHelper {

	@Override
	public SIdentifier asIdentifier(SReference parameter) {
		String name = parameter.getName();
		ExpressionFactory factory = ExpressionFactory.INSTANCE;
		return factory.createIdentifier(name);
	}

	@Override
	public Collection<SExpression> collectSubExpression(SExpression expression) {
		XExpression xExpression = (XExpression) expression;
		List<SExpression> expressions = new ArrayList<>();
		collectSubExpression(expressions, xExpression, SExpression.class);
		return expressions;
	}

	private <T> void collectSubExpression(List<T> expressions, XExpression expression,
			Class<? extends T> matchClass) {
		EFeature[] features = expression.eFeatures();
		for (EFeature feature : features) {
			Object object = expression.eGet(feature);
			collectExpression(expressions, object, matchClass);
		}
	}

	@Override
	public <T> Collection<T> collectExpression(SExpression expression, Class<? extends T> matchClass) {
		XExpression xExpression = (XExpression) expression;
		List<T> expressions = new ArrayList<>();
		collectExpression(expressions, xExpression, matchClass);
		return expressions;
	}

	private <T> void collectExpression(List<T> expressions, Object object, Class<? extends T> matchClass) {
		if (matchClass.isInstance(object)) {
			T cast = matchClass.cast(object);
			expressions.add(cast);
		} else if (object instanceof EList) {
			EList<?> list = (EList<?>) object;
			for (int i = 0; i < list.size(); i++) {
				Object element = list.get(i);
				collectExpression(expressions, element, matchClass);
			}
		} else if (object instanceof EMap) {
			EMap<?> map = (EMap<?>) object;
			for (String key : map.keySet()) {
				Object value = map.get(key);
				collectExpression(expressions, value, matchClass);
			}
		} else if (object instanceof XExpression) {
			XExpression expression = (XExpression) object;
			collectSubExpression(expressions, expression, matchClass);
		} else if (object instanceof XAssignment) {
			XAssignment assignment = (XAssignment) object;
			XExpression expression = assignment.getExpression();
			collectSubExpression(expressions, expression, matchClass);
		}
	}

	@Override
	public void replace(SExpression oldExpression, SExpression newExpression) {
		EUtils.replace((EObject) oldExpression, (EObject) newExpression);
	}

}
