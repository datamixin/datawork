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
package com.andia.mixin.bekasi.webface.converters;

import java.lang.annotation.Annotation;
import java.lang.reflect.Type;

import javax.inject.Named;
import javax.ws.rs.ext.ParamConverter;
import javax.ws.rs.ext.ParamConverterProvider;

import com.andia.mixin.Lean;
import com.andia.mixin.bekasi.reconciles.HeartbeatReconcile;
import com.andia.mixin.model.EObject;
import com.andia.mixin.model.EPackage;
import com.andia.mixin.model.Namespace;
import com.andia.mixin.rmo.FeatureCall;
import com.andia.mixin.rmo.FeatureKey;
import com.andia.mixin.rmo.FeaturePath;
import com.andia.mixin.rmo.ListFeatureKey;
import com.andia.mixin.rmo.MapFeatureKey;
import com.andia.mixin.rmo.Modification;
import com.andia.mixin.rmo.ModificationOrder;

public abstract class BaseParamConverterProvider implements ParamConverterProvider {

	private LeanJsonParamConverter leanJsonParamConverter;
	private EObjectJsonParamConverter eObjectJsonParamConverter;
	private EPackage ePackage;

	public BaseParamConverterProvider(EPackage ePackage) {
		this.ePackage = ePackage;
		prepareEObjectJsonParamConverter(ePackage);
		prepareLeanJsonParamConverter(ePackage);
	}

	private void prepareEObjectJsonParamConverter(EPackage ePackage) {
		eObjectJsonParamConverter = new EObjectJsonParamConverter(ePackage);
	}

	private void prepareLeanJsonParamConverter(EPackage ePackage) {
		leanJsonParamConverter = new LeanJsonParamConverter(
				ePackage,
				eObjectJsonParamConverter,
				FeatureKey.class,
				FeatureCall.class,
				FeaturePath.class,
				Modification.class,
				MapFeatureKey.class,
				ListFeatureKey.class,
				ModificationOrder.class,
				HeartbeatReconcile.class);
	}

	public void addLeanClass(Class<? extends Lean> leanClass) {
		leanJsonParamConverter.addClass(leanClass);
	}

	public <T> ParamConverter<T> getConverter(Class<T> classType) {
		Named named = new Named() {

			@Override
			public Class<? extends Annotation> annotationType() {
				return Named.class;
			}

			@Override
			public String value() {
				Namespace namespace = ePackage.getMainNamespace();
				return namespace.getName();
			}

		};

		return getConverter(classType, null, new Annotation[] { named });
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T> ParamConverter<T> getConverter(Class<T> classType, Type type, Annotation[] annotations) {
		if (EObject.class.isAssignableFrom(classType)) {
			String simpleName = classType.getSimpleName();
			Namespace[] namespaces = ePackage.getNamespaces();
			for (Namespace namespace : namespaces) {
				String modelName = namespace.getName();
				String eClassName = modelName + "://" + simpleName;
				Class<? extends EObject> eClass = ePackage.getEClass(eClassName);
				if (eClass != null) {
					return (ParamConverter<T>) eObjectJsonParamConverter;
				}
			}
			return null;
		} else if (Lean.class.isAssignableFrom(classType)) {
			if (annotations != null) {
				for (Annotation annotation : annotations) {
					if (annotation instanceof Named) {
						Named named = (Named) annotation;
						String value = named.value();
						Namespace[] namespaces = ePackage.getNamespaces();
						for (Namespace namespace : namespaces) {
							String name = namespace.getName();
							if (value.equals(name)) {
								return (ParamConverter<T>) leanJsonParamConverter;
							}
						}
					}
				}
			}
			return null;
		} else {
			return null;
		}
	}
}
