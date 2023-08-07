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
package com.andia.mixin.padang.garut;

import static org.junit.Assert.fail;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.UUID;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import com.andia.mixin.Options;
import com.andia.mixin.base.MapOptions;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.ProminerTransmutation;
import com.andia.mixin.padang.dumai.Transformation;
import com.andia.mixin.sleman.ParserException;
import com.andia.mixin.sleman.api.ExpressionFactory;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.value.MixinArray;
import com.andia.mixin.value.MixinError;
import com.andia.mixin.value.MixinList;
import com.andia.mixin.value.MixinRecord;
import com.andia.mixin.value.MixinRecordSet;
import com.andia.mixin.value.MixinTable;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class GarutDatasetTest {

	private static final String DATA_FORM = "DataForm";

	private static final String ROW_COUNT = "RowCount";
	private static final String ROW_RANGE = "RowRange";

	private static final String COLUMN_KEYS = "ColumnKeys";
	private static final String COLUMN_EXISTS = "ColumnExists";

	private static final String REMOVE_COLUMNS = "RemoveColumns";

	private static GarutProminer dataminer = new GarutProminer();
	private static String project = "project";
	private static String preBlank = "pre-blank";
	private static String newBlank = "new-blank";
	private static String preDataset = "pre-dataset";
	private static String newDataset = "new-dataset";
	private static String keys = "keys";
	private static String A = "A";
	private static String B = "B";
	private static int A1 = 1;
	private static int A2 = 2;
	private static String B1 = "a";
	private static String B2 = "b";
	private static String data = "data";
	private static String dataValue = "{" + A + ":[" + A1 + ", " + A2 + "], " + B + ":['" + B1 + "', '" + B2 + "']}";
	private static String types = "types";
	private static String typesValue = "{" + A + ":'int32', " + B + ":'string'}";

	private static ExpressionFactory factory = ExpressionFactory.INSTANCE;

	@Test
	@Order(10)
	public void testInit() throws ProminerException {
		UUID fileId = UUID.nameUUIDFromBytes(project.getBytes());
		Options options = new MapOptions();
		dataminer.init("space", fileId, options);
	}

	@Test
	@Order(100)
	public void testPreparePreDataForm() {
		dataminer.prepareDataset(preBlank);
	}

	@Test
	@Order(110)
	public void testRenamePreDataFormToDataForm() throws ProminerException {
		dataminer.renameSheet(preBlank, newBlank);
	}

	@Test
	@Order(120)
	public void testSelectDataFormFirst() throws ProminerException {
		Transformation transmutation = new ProminerTransmutation(ROW_COUNT);
		Object count = dataminer.selectDatasetResult(newBlank, transmutation, true);
		assertNumberEquals(count, 0L);
	}

	private void assertNumberEquals(Object object, Number number) {
		assertTrue(object instanceof Number);
		assertEquals(number, object);
	}

	@Test
	@Order(300)
	public void testPreparePreparedDataset() {
		dataminer.prepareDataset(preDataset);
	}

	@Test
	@Order(310)
	public void testPreparePreparation() throws ProminerException {
		dataminer.preparePreparation(preDataset);
	}

	@Test
	@Order(320)
	public void testInsertFirstPreparationMutation() throws Exception {

		ProminerTransmutation transmutation = new ProminerTransmutation(DATA_FORM);
		ExpressionFactory factory = ExpressionFactory.INSTANCE;
		transmutation.setOption(data, factory.parse(dataValue));
		transmutation.setOption(types, factory.parse(typesValue));
		dataminer.insertPreparationMutation(preDataset, 0, transmutation);

		Object list = selectPreparationMutationResult(COLUMN_KEYS);
		assertNotError(list);
		assertListElementEquals(list, 0, A);
		assertListElementEquals(list, 1, B);
	}

	private void assertNotError(Object object) {
		if (object instanceof MixinError) {
			MixinError error = (MixinError) object;
			String message = error.getMessage();
			fail(message);
		}
	}

	private Object selectPreparationMutationResult(String operation) throws ProminerException {
		Transformation transmutation = new ProminerTransmutation(operation);
		return dataminer.selectPreparationMutationResult(preDataset, 0, transmutation);
	}

	@Test
	@Order(321)
	public void testSelectPreparationResultColumnExists() throws ProminerException {
		assertColumnExists(A);
		assertColumnExists(B);
	}

	private void assertColumnExists(String name) throws ProminerException {
		ProminerTransmutation transmutation = new ProminerTransmutation(COLUMN_EXISTS);
		transmutation.setOption("name", factory.createText(name));
		Object object = dataminer.selectPreparationMutationResult(preDataset, 0, transmutation);
		assertEquals(true, object);
	}

	@Test
	@Order(322)
	public void testSelectPreparationResultCellValue() throws ProminerException {
		ProminerTransmutation transmutation = new ProminerTransmutation(ROW_RANGE);
		transmutation.setOption("rowStart", factory.createNumber(0));
		transmutation.setOption("rowEnd", factory.createNumber(2));
		transmutation.setOption("columnStart", factory.createNumber(0));
		transmutation.setOption("columnEnd", factory.createNumber(2));
		Object object = dataminer.selectPreparationMutationResult(preDataset, 0, transmutation);
		MixinTable table = assertTableShape(object, 2, 3);
		assertTableCellValue(table, 0, 1, A1);
		assertTableCellValue(table, 1, 1, A2);
		assertTableCellValue(table, 0, 2, B1);
		assertTableCellValue(table, 1, 2, B2);
	}

	private MixinTable assertTableShape(Object object, int rows, int columns) {
		assertTrue(object instanceof MixinTable);
		MixinTable table = (MixinTable) object;
		MixinRecordSet recordSet = table.recordSet();
		int rowCount = 0;
		while (recordSet.next()) {
			recordSet.getRecord();
			rowCount++;
		}
		assertEquals(rows, rowCount);
		assertEquals(columns, table.columnCount());
		return table;
	}

	private void assertTableCellValue(MixinTable table, int row, int column, Object value) {
		MixinRecordSet recordSet = table.recordSet();
		int rowCount = 0;
		while (recordSet.next()) {
			MixinRecord record = recordSet.getRecord();
			if (rowCount == row) {
				Object object = record.get(column);
				assertEquals(value, object);
				break;
			}
			rowCount++;
		}
	}

	@Test
	@Order(330)
	public void testInsertSecondPreparationMutation() throws Exception {

		Transformation transmutation = createRemoveColumnBDirection();
		dataminer.insertPreparationMutation(preDataset, 1, transmutation);

		Object list = selectPreparationMutationResult(COLUMN_KEYS);
		assertListElementEquals(list, 0, A);
	}

	private Transformation createRemoveColumnBDirection() throws ParserException {
		ProminerTransmutation transmutation = new ProminerTransmutation(REMOVE_COLUMNS);
		ExpressionFactory factory = ExpressionFactory.INSTANCE;
		SExpression expression = factory.parse("['" + B + "']");
		transmutation.setOption(keys, expression);
		return transmutation;
	}

	@Test
	@Order(340)
	public void testRemoveSecondPreparationMutation() throws Exception {
		dataminer.removePreparationMutation(preDataset, 1);
		Object list = selectPreparationMutationResult(COLUMN_KEYS);
		assertListElementEquals(list, 0, A);
		assertListElementEquals(list, 1, B);
	}

	@Test
	@Order(350)
	public void testApplyPreparationResult() throws ProminerException {
		dataminer.applySourceResult(preDataset);
	}

	@Test
	@Order(360)
	public void testSelectDatasetPostPreparation() throws ProminerException {
		Object list = selectDataset(COLUMN_KEYS);
		assertListElementEquals(list, 0, A);
		assertListElementEquals(list, 1, B);
	}

	private Object selectDataset(String operation) throws ProminerException {
		Transformation transmutation = new ProminerTransmutation(operation);
		return dataminer.selectDatasetResult(preDataset, transmutation, true);
	}

	@Test
	@Order(430)
	public void testInsertDisplayMutation() throws Exception {
		Transformation transmutation = createRemoveColumnBDirection();
		dataminer.insertDatasetDisplayMutation(preDataset, 0, transmutation);
		Object list = selectDataset(COLUMN_KEYS);
		assertListElementEquals(list, 0, A);
	}

	private void assertListElementEquals(Object object, int i, Object value) {
		assertTrue(object instanceof MixinList);
		MixinList list = (MixinList) object;
		MixinArray array = list.toArray();
		assertTrue(array.size() > i);
		assertEquals(value, array.get(i));
	}

	@Test
	@Order(440)
	public void testRemoveDisplayMutation() throws Exception {
		dataminer.removeDatasetDisplayMutation(preDataset, 0);
		Object list = selectDataset(COLUMN_KEYS);
		assertListElementEquals(list, 0, A);
		assertListElementEquals(list, 1, B);
	}

	@Test
	@Order(500)
	public void testSelectDatasetLast() throws ProminerException {
		Object count = selectDataset(ROW_COUNT);
		assertNumberEquals(count, 2L);
	}

	@Test
	@Order(600)
	public void testRenameDatasetToNewDataset() throws ProminerException {
		dataminer.renameSheet(preDataset, newDataset);
	}

	@Test
	@Order(700)
	public void testRemovePreparation() throws ProminerException {
		dataminer.removeSheet(newDataset);
	}

	@Test
	@Order(710)
	public void testRemoveDataset() {
		dataminer.removeSheet(newBlank);
	}

	@Test
	@Order(800)
	public void testRemoveProject() throws ProminerException {
		dataminer.removeProject();
	}

}
