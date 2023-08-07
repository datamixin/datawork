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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.UUID;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import com.andia.mixin.Options;
import com.andia.mixin.base.MapOptions;
import com.andia.mixin.padang.dumai.Prominer;
import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.sleman.api.ExpressionFactory;
import com.andia.mixin.sleman.api.SReference;
import com.andia.mixin.sleman.api.SText;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class GarutOutlookTest {

	private static ExpressionFactory factory = ExpressionFactory.INSTANCE;
	private static Prominer datastore = new GarutProminer();
	private static String project = "project";
	private static String preOutlook = "preOutlook";
	private static String outlook = "outlook";
	private static String preOutlookVariable = "preOutlookVariable";
	private static String viewsetVariable = "viewsetVariable";
	private static String preOutlookFigure = "preOutlookFigure";
	private static String viewsetFigure = "viewsetFigure";
	private static String preFigureVariable = "preFigureVariable";
	private static String figureVariable = "figureVariable";
	private static String text = "text";

	@Test
	@Order(10)
	public void testInit() throws ProminerException {
		UUID fileId = UUID.nameUUIDFromBytes(project.getBytes());
		Options options = new MapOptions();
		datastore.init("space", fileId, options);
	}

	// ========================================================================
	// VIEWSET
	// ========================================================================

	@Test
	@Order(100)
	public void testPrepareOutlook() throws Exception {
		datastore.prepareOutlook(preOutlook);
	}

	@Test
	@Order(110)
	public void testRenameOutlook() throws Exception {
		datastore.renameSheet(preOutlook, outlook);
	}

	// ========================================================================
	// VIEWSET VARIABLE
	// ========================================================================

	@Test
	@Order(200)
	public void testPrepareOutlookVariable() throws Exception {
		datastore.prepareOutcome(outlook, preOutlookVariable);
	}

	@Test
	@Order(210)
	public void testRenameOutlookVariable() throws Exception {
		datastore.renameOutlet(outlook, preOutlookVariable, viewsetVariable);
	}

	@Test
	@Order(220)
	public void testAssignOutlookVariableExpression() throws Exception {
		SText expression = factory.createText(text);
		datastore.assignOutcomeExpression(outlook, viewsetVariable, expression);
	}

	@Test
	@Order(230)
	public void testEvaluateOutlook() throws Exception {
		SReference variableRerefence = factory.createReference(viewsetVariable);
		Object result = datastore.evaluateOnForesee(outlook, variableRerefence);
		assertTrue(result instanceof String);
		assertEquals(text, result);
	}

	// ========================================================================
	// VIEWSET FIGURE
	// ========================================================================

	@Test
	@Order(300)
	public void testPrepareOutlookFigure() throws Exception {
		datastore.prepareFigure(outlook, preOutlookFigure);
	}

	@Test
	@Order(310)
	public void testRenameOutlookFigure() throws Exception {
		datastore.renameOutlet(outlook, preOutlookFigure, viewsetFigure);
	}

	// ========================================================================
	// FIGURE VARIABLE
	// ========================================================================

	@Test
	@Order(400)
	public void testPrepareFigureVariable() throws Exception {
		datastore.prepareFigureVariable(outlook, viewsetFigure, preFigureVariable);
	}

	@Test
	@Order(410)
	public void testRenameFigureVariable() throws Exception {
		datastore.renameFigureVariable(outlook, viewsetFigure, preFigureVariable, figureVariable);
	}

	@Test
	@Order(420)
	public void testAssignFigureVariableExpression() throws Exception {
		SText expression = factory.createText(text);
		datastore.assignFigureVariableExpression(outlook, viewsetFigure, figureVariable, expression);
	}

	@Test
	@Order(430)
	public void testEvaluateFigure() throws Exception {
		SReference variableReference = factory.createReference(figureVariable);
		Object result = datastore.evaluateOnFigure(outlook, viewsetFigure, variableReference);
		assertTrue(result instanceof String);
		assertEquals(text, result);
	}

	@Test
	@Order(900)
	public void testRemoveOutlookVariable() throws Exception {
		datastore.removeOutlet(outlook, viewsetVariable);
	}

	@Test
	@Order(910)
	public void testRemoveFigureVariable() throws Exception {
		datastore.removeFigureVariable(outlook, viewsetFigure, figureVariable);
	}

	@Test
	@Order(920)
	public void testRemoveOutlook() throws Exception {
		datastore.removeSheet(outlook);
	}

}
