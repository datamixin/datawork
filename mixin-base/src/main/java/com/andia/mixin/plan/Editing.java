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

import com.andia.mixin.value.MixinType;

public final class Editing {

	private static final String EDITING = "=" + Editing.class.getSimpleName() + ".";

	public final static String PointerSelection(MixinType type) {
		return EDITING + "PointerSelection('" + type + "')";
	}

	public final static String TableColumnObjectFieldNames(String tableParam, String columnParam) {
		return EDITING + "TableColumnObjectFieldNames('" + tableParam + "', '" + columnParam + "')";
	}

	public final static String TableColumnTableColumnNames(String tableParam, String columnParam) {
		return EDITING + "TableColumnTableColumnNames('" + tableParam + "', '" + columnParam + "')";
	}

	public final static String TableColumnNames(String tableParam) {
		return EDITING + "TableColumnNames('" + tableParam + "')";
	}

	public final static String ExcelSheetNames(String excelParam) {
		return EDITING + "ExcelSheetNames('" + excelParam + "')";
	}

	public final static String ExtendedFunctions(Class<?> functionClass) {
		String simpleName = functionClass.getSimpleName();
		return EDITING + "ExtendedFunctions('" + simpleName + "')";
	}

	public final static String ImplementedInterfaces(Class<?> functionClass) {
		String simpleName = functionClass.getSimpleName();
		return EDITING + "ImplementedInterfaces('" + simpleName + "')";
	}

	public final static String PreviousFieldValues(String fieldName) {
		return EDITING + "PreviousFieldValues('" + fieldName + "')";
	}

	public final static String ConnectorDirectory(String connectorType) {
		return EDITING + "ConnectorDirectory('" + connectorType + "')";
	}

	public final static String FileNavigator(String connectorParam) {
		return EDITING + "FileNavigator('" + connectorParam + "')";
	}

	public final static String DataNavigator(String connectorParam) {
		return EDITING + "DataNavigator('" + connectorParam + "')";
	}

	public final static String DefaultFileNavigator(String connectorName) {
		return EDITING + "DefaultFileNavigator('" + connectorName + "')";
	}

	public final static String DatabaseDriverNames() {
		return EDITING + "DatabaseDriverNames()";
	}

}
