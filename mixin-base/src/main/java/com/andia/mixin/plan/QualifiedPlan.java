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
package com.andia.mixin.plan;

import java.lang.annotation.Annotation;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.andia.mixin.value.MixinValue;

public class QualifiedPlan extends AssignedPlan {

	private static final char DOT = '.';
	private String name;
	private String label;
	private String qualifiedName;
	private Class<?> qualifiedClass;
	private SpecifiedPlanList parameters = new SpecifiedPlanList();
	private String resultType = MixinValue.class.getSimpleName();
	private List<String> definedAnnotations = null;

	private QualifiedPlan(Class<?> qualifiedClass, String name, String label) {
		super(QualifiedPlan.class);
		this.name = name;
		this.label = label;
		this.qualifiedName = name;
		this.qualifiedClass = qualifiedClass;
	}

	public QualifiedPlan(Class<?> qualifiedClass) {
		this(qualifiedClass, qualifiedClass.getSimpleName(), qualifiedClass.getSimpleName());
	}

	public QualifiedPlan applyPackage(String module) {
		qualifiedName = module + DOT + qualifiedName;
		return this;
	}

	public String getName() {
		return name;
	}

	public String getLabel() {
		return label;
	}

	public QualifiedPlan setLabel(String label) {
		this.label = label;
		return this;
	}

	public QualifiedPlan setResultType(Class<? extends MixinValue> resultType) {
		this.resultType = resultType.getSimpleName();
		return this;
	}

	public String getResultType() {
		return resultType;
	}

	public Class<?> getQualifiedClass() {
		return qualifiedClass;
	}

	public Object newQualified() throws Exception {
		return qualifiedClass.newInstance();
	}

	public SpecifiedPlanList getParameters() {
		return parameters;
	}

	public String getQualifiedName() {
		return qualifiedName;
	}

	public Collection<String> getSuperClasses() {
		List<String> classes = new ArrayList<>();
		Class<?> superclass = qualifiedClass.getSuperclass();
		while (superclass != null && superclass != Object.class) {
			String className = superclass.getSimpleName();
			classes.add(className);
			superclass = superclass.getSuperclass();
		}
		return classes;
	}

	public Collection<String> getDefinedAnnotations() {
		if (definedAnnotations != null) {
			return definedAnnotations;
		} else {
			definedAnnotations = new ArrayList<>();
			Class<?> currentClass = qualifiedClass;
			while (currentClass != null && currentClass != Object.class) {
				collectAnnotations(currentClass);
				Class<?>[] interfaces = currentClass.getInterfaces();
				for (Class<?> iface : interfaces) {
					collectAnnotations(iface);
				}
				currentClass = currentClass.getSuperclass();
			}
			return definedAnnotations;
		}
	}

	private void collectAnnotations(Class<?> type) {
		Annotation[] annotations = type.getDeclaredAnnotations();
		for (Annotation annotation : annotations) {
			Class<?> aClass = annotation.annotationType();
			addDefinedAnnotation(aClass);
		}
	}

	public void addDefinedAnnotation(Class<?> aClass) {
		String simpleName = aClass.getSimpleName();
		if (!definedAnnotations.contains(simpleName)) {
			definedAnnotations.add(simpleName);
		}
	}

	public Collection<String> getImplementedInterfaces() {
		List<String> classes = new ArrayList<>();
		Class<?> currentClass = qualifiedClass;
		while (currentClass != null && currentClass != Object.class) {
			Class<?>[] interfaces = currentClass.getInterfaces();
			for (Class<?> iface : interfaces) {
				String className = iface.getSimpleName();
				if (!classes.contains(className)) {
					classes.add(className);
				}
			}
			currentClass = currentClass.getSuperclass();
		}
		return classes;
	}

}
