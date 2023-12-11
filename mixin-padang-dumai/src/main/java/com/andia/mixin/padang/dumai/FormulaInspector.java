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
package com.andia.mixin.padang.dumai;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.andia.mixin.bekasi.ConsolidatorPath;
import com.andia.mixin.padang.dumai.anchors.OriginAnchor;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.ParserException;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.api.SPointer;
import com.andia.mixin.sleman.base.ExpressionCollector;

public class FormulaInspector {

	private OriginAnchor origin;
	private SExpression expression;

	public FormulaInspector(Supervisor supervisor, String formula) throws ParserException {
		origin = supervisor.getPreparedObject(OriginAnchor.class);
		readExpression(formula);
	}

	private void readExpression(String formula) throws ParserException {
		FormulaParser parser = new FormulaParser();
		expression = parser.parse(formula);
	}

	public Map<SPointer, String> getMatchPointers(ConsolidatorPath path) {
		ExpressionCollector collector = ExpressionCollector.getInstance();
		List<SPointer> instances = collector.collect(SPointer.class, expression);
		Map<SPointer, String> pointers = new LinkedHashMap<>();
		for (SPointer pointer : instances) {
			String[] pointerPath = origin.getFullPath(pointer);
			if (path.isMatches(pointerPath)) {
				String lastPart = pointerPath[pointerPath.length - 1];
				String newName = path.getNewName(lastPart);
				pointers.put(pointer, newName);
			}
		}
		return pointers;
	}

	public SExpression getExpression() {
		return expression;
	}

}
