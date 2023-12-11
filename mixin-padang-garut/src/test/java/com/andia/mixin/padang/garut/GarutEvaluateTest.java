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
package com.andia.mixin.padang.garut;

import static org.junit.Assert.fail;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.andia.mixin.Options;
import com.andia.mixin.base.MapOptions;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.garut.values.GarutError;
import com.andia.mixin.padang.garut.values.GarutObject;
import com.andia.mixin.padang.garut.values.GarutTable;
import com.andia.mixin.sleman.ParserException;
import com.andia.mixin.sleman.api.ExpressionFactory;
import com.andia.mixin.sleman.api.SAlias;
import com.andia.mixin.sleman.api.SAssignment;
import com.andia.mixin.sleman.api.SBinary;
import com.andia.mixin.sleman.api.SCall;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.api.SForeach;
import com.andia.mixin.sleman.api.SLet;
import com.andia.mixin.sleman.api.SList;
import com.andia.mixin.sleman.api.SLogical;
import com.andia.mixin.sleman.api.SNumber;
import com.andia.mixin.sleman.api.SObject;
import com.andia.mixin.sleman.api.SReference;
import com.andia.mixin.sleman.api.SText;
import com.andia.mixin.value.MixinColumn;
import com.andia.mixin.value.MixinRecord;
import com.andia.mixin.value.MixinRecordSet;
import com.andia.mixin.value.MixinTableMetadata;

public class GarutEvaluateTest {

	private static final String DATA_FORM = "DataForm";
	private static final String SELECT_COLUMNS = "SelectColumns";
	private static final String IF = "If";
	private static final String IS_NULL = "IsNull";
	private static final String COLUMN_EXPRESSION = "expression";
	private static final String COLUMN_ALIAS = "alias";

	private static final String SELECT_ROWS = "SelectRows";
	private static final String GROUP_ROWS = "GroupRows";
	private static final String SORT_ROWS = "SortRows";

	private static final String HISTOGRAM = "Histogram";
	private static final String HISTOGRAM_VALUES = "values";
	private static final String HISTOGRAM_EDGES = "edges";
	private static final String HISTOGRAM_NULLS = "nulls";

	private static final String AGGREGATE_SUM = "Sum";
	private static final String AGGREGATE_COUNT_ALL = "CountAll";
	private static final String GRUOP_ALIAS = "alias";
	private static final String GROUP_AGGREGATE = "aggregate";
	private static final String ORDER_COLUMN = "column";
	private static final String ORDER_ASCENDING = "ascending";

	private static ExpressionFactory factory = ExpressionFactory.INSTANCE;
	private static GarutProminer datastore = new GarutProminer();
	private static String project = "project";
	private static String dataset = "dataset";
	private static String rows = "rows";
	private static String columns = "columns";
	private static String group = "group";
	private static String sort = "sort";
	private static String histogram = "histogram";
	private static String A = "A";
	private static Integer A1 = 1;
	private static Integer A2 = 2;
	private static Integer A3 = null;
	private static String B = "B";
	private static String B1 = "a";
	private static String B2 = null;
	private static String B3 = "c";
	private static String dataValue = "{" +
			A + ":[" + A1 + ", " + A2 + ", " + A3 + "], " +
			B + ":['" + B1 + "', '" + B2 + "', '" + B3 + "']}";

	@BeforeAll
	public static void beforeAll() throws ProminerException {
		UUID fileId = UUID.nameUUIDFromBytes(project.getBytes());
		Options options = new MapOptions();
		datastore.init("space", fileId, options);
		datastore.prepareDataset(dataset);
	}

	@Test
	public void testSelectColumns() throws Exception {

		List<SAssignment> variables = new ArrayList<>();
		SReference datasetVariable = createDatasetVariable(variables);
		SReference columnsVaruable = createAColumnsVariable(datasetVariable, variables);

		SLet query = factory.createLet(variables, columnsVaruable);
		Object object = datastore.evaluateOnForesee(dataset, query);

		GarutTable table = assertTable(object);
		assertEquals(2, table.columnCount());
		assertColumnName(table, 1, A);
		assertRecordCount(table, 3);

	}

	private SReference createAColumnsVariable(SReference datasetReference, List<SAssignment> variables) {
		SText aColumn = factory.createText(A);
		SList columnList = factory.createList(aColumn);
		SCall call = createCall(SELECT_COLUMNS, datasetReference, columnList);
		addVariable(variables, columns, call);
		return factory.createReference(columns);
	}

	private void addVariable(List<SAssignment> variables, String name, SCall call) {
		SAssignment variable = factory.createAssignment(name, call);
		variables.add(variable);
	}

	private SReference createDatasetVariable(List<SAssignment> variables) throws ParserException {

		SExpression expression = factory.parse(dataValue);
		SCall call = createCall(DATA_FORM, expression);

		SAssignment variable = factory.createAssignment(dataset, call);
		variables.add(variable);

		SReference reference = factory.createReference(dataset);
		return reference;

	}

	private GarutTable assertTable(Object object) {
		checkError(object);
		assertTrue(object instanceof GarutTable);
		return (GarutTable) object;
	}

	private void checkError(Object object) {
		if (object instanceof GarutError) {
			GarutError error = (GarutError) object;
			fail(error.getMessage());
		}
	}

	private SCall createCall(String name, SExpression... args) {
		SReference dataForm = factory.createReference(name);
		SCall call = factory.createCall(dataForm, args);
		return call;
	}

	@Test
	public void testSelectColumnValues() throws Exception {

		String nullValue = "__null__";
		SAlias aAliasForIsNull = factory.createAlias(A);
		SCall isNullCall = factory.createCall(IS_NULL, aAliasForIsNull);
		SAlias aAliasForIf = factory.createAlias(A);
		SText textForIf = factory.createText(nullValue);
		SCall ifCall = factory.createCall(IF, isNullCall, textForIf, aAliasForIf);
		SForeach aForeach = factory.createForeach(ifCall);
		SAssignment expressionAssignment = factory.createAssignment(COLUMN_EXPRESSION, aForeach);
		SText aAlias = factory.createText(A);
		SAssignment aliasAssignment = factory.createAssignment(COLUMN_ALIAS, aAlias);
		SObject value = factory.createObject(expressionAssignment, aliasAssignment);
		SList valueList = factory.createList(value);

		List<SAssignment> variables = new ArrayList<>();
		SReference datasetVariable = createDatasetVariable(variables);
		SCall call = createCall(SELECT_COLUMNS, datasetVariable, valueList);
		addVariable(variables, columns, call);
		SReference columnsResult = factory.createReference(columns);

		SLet query = factory.createLet(variables, columnsResult);
		Object object = datastore.evaluateOnForesee(dataset, query);

		GarutTable table = assertTable(object);
		assertEquals(2, table.columnCount());
		assertColumnName(table, 1, A);
		assertRecordCount(table, 3);
		assertRecordCell(table, 2, 1, nullValue);

	}

	private void assertRecordCell(GarutTable table, int i, int j, String nullValue) {
		MixinRecordSet recordSet = table.recordSet();
		for (int k = 0; k < i; k++) {
			assertTrue(recordSet.next());
			recordSet.getRecord();
		}
		MixinRecord record = recordSet.getRecord();
		assertEquals(nullValue, record.get(j));
	}

	@Test
	public void testSelectRows() throws Exception {

		List<SAssignment> variables = new ArrayList<>();
		SReference datasetVariable = createDatasetVariable(variables);

		SAlias aColumn = factory.createAlias(A);
		SNumber number1 = factory.createNumber(1);
		SBinary equalsBinary = factory.createBinary(aColumn, "==", number1);
		SForeach whereForeach = factory.createForeach(equalsBinary);
		SCall rowsCall = createCall(SELECT_ROWS, datasetVariable, whereForeach);
		addVariable(variables, rows, rowsCall);
		SReference rowsReference = factory.createReference(rows);

		SLet query = factory.createLet(variables, rowsReference);
		Object object = datastore.evaluateOnForesee(dataset, query);

		GarutTable table = assertTable(object);
		assertEquals(3, table.columnCount());
		assertColumnName(table, 1, A);
		assertColumnName(table, 2, B);
		assertRecordCount(table, 1);

	}

	@Test
	public void testGroupRows() throws Exception {

		List<SAssignment> variables = new ArrayList<>();
		SReference datasetVariable = createDatasetVariable(variables);

		SText bColumn = factory.createText(B);
		SList keyList = factory.createList(bColumn);

		SObject sum = createGroupValue(AGGREGATE_SUM, A);
		SObject count = createGroupCountAll();
		SList valueList = factory.createList(sum, count);

		SCall groupCall = createCall(GROUP_ROWS, datasetVariable, keyList, valueList);
		addVariable(variables, group, groupCall);

		SReference columnResult = factory.createReference(group);
		SLet query = factory.createLet(variables, columnResult);
		Object object = datastore.evaluateOnForesee(dataset, query);

		GarutTable table = assertTable(object);
		assertEquals(4, table.columnCount());
		assertColumnName(table, 1, B);
		assertColumnName(table, 2, A);
		assertColumnName(table, 3, AGGREGATE_COUNT_ALL);
		assertRecordCount(table, 3);

	}

	@Test
	public void testGroupRowsNoKeys() throws Exception {

		List<SAssignment> variables = new ArrayList<>();
		SReference datasetVariable = createDatasetVariable(variables);
		SReference columnsVariable = createAColumnsVariable(datasetVariable, variables);

		SList keyList = factory.createList();
		SObject count = createGroupCountAll();
		SList valueList = factory.createList(count);

		SCall groupCall = createCall(GROUP_ROWS, columnsVariable, keyList, valueList);
		addVariable(variables, group, groupCall);

		SReference columnResult = factory.createReference(group);
		SLet query = factory.createLet(variables, columnResult);
		Object object = datastore.evaluateOnForesee(dataset, query);

		GarutTable table = assertTable(object);
		assertEquals(2, table.columnCount());
		assertColumnName(table, 1, AGGREGATE_COUNT_ALL);
		assertRecordCount(table, 1);

	}

	private void assertColumnName(GarutTable table, int index, String name) {
		MixinColumn column = table.getColumn(index);
		Object key = column.getKey();
		assertEquals(name, key);
	}

	private SObject createGroupValue(String function, String column) {
		SAlias columnAlias = factory.createAlias(column);
		return createGroupAggregate(function, column, columnAlias);
	}

	private void assertRecordCount(GarutTable table, int count) {
		MixinTableMetadata metadata = table.getMetadata();
		assertEquals(count, metadata.getRecordCount());
	}

	private SObject createGroupCountAll() {
		return createGroupAggregate(AGGREGATE_COUNT_ALL, AGGREGATE_COUNT_ALL);
	}

	private SObject createGroupAggregate(String function, String alias, SAlias... args) {

		SReference aggPointer = factory.createReference(function);
		SCall aggCall = factory.createCall(aggPointer, args);
		SForeach aggForeach = factory.createForeach(aggCall);
		SAssignment aggAssignment = factory.createAssignment(GROUP_AGGREGATE, aggForeach);

		SText aggAlias = factory.createText(alias);
		SAssignment aliasAssignment = factory.createAssignment(GRUOP_ALIAS, aggAlias);

		SObject value = factory.createObject(Arrays.asList(aliasAssignment, aggAssignment));
		return value;
	}

	@Test
	public void testSortRows() throws Exception {

		List<SAssignment> variables = new ArrayList<>();
		SReference datasetVariable = createDatasetVariable(variables);

		SText aColumn = factory.createText(A);
		SAssignment columnAssignment = factory.createAssignment(ORDER_COLUMN, aColumn);

		SLogical aAscending = factory.createLogical(false);
		SAssignment ascendingAssignment = factory.createAssignment(ORDER_ASCENDING, aAscending);

		SObject orderObject = factory.createObject(Arrays.asList(columnAssignment, ascendingAssignment));
		SList valueList = factory.createList(orderObject);
		SCall rowsCall = createCall(SORT_ROWS, datasetVariable, valueList);
		addVariable(variables, sort, rowsCall);
		SReference rowsReference = factory.createReference(sort);

		SLet query = factory.createLet(variables, rowsReference);
		Object object = datastore.evaluateOnForesee(dataset, query);

		GarutTable table = assertTable(object);
		assertEquals(3, table.columnCount());
		assertColumnName(table, 1, A);
		assertColumnName(table, 2, B);
		assertRecordCount(table, 3);

	}

	@Test
	public void testHistogram() throws Exception {

		List<SAssignment> variables = new ArrayList<>();
		SReference datasetVariable = createDatasetVariable(variables);
		SReference columnsVariable = createAColumnsVariable(datasetVariable, variables);

		SCall histogramCall = createCall(HISTOGRAM, columnsVariable);
		addVariable(variables, histogram, histogramCall);
		SReference histogramReference = factory.createReference(histogram);

		SLet query = factory.createLet(variables, histogramReference);
		Object result = datastore.evaluateOnForesee(dataset, query);

		GarutObject object = assertObject(result);
		assertEquals(3, object.fieldCount());
		assertFieldExist(object, HISTOGRAM_VALUES);
		assertFieldExist(object, HISTOGRAM_EDGES);
		assertFieldExist(object, HISTOGRAM_NULLS);
		assertEquals(1L, object.get(HISTOGRAM_NULLS));

	}

	private GarutObject assertObject(Object object) {
		checkError(object);
		assertTrue(object instanceof GarutObject);
		return (GarutObject) object;
	}

	private void assertFieldExist(GarutObject object, String name) {
		Collection<String> names = object.fieldNames();
		assertTrue(names.contains(name));
	}

}
