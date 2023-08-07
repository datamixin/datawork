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
package com.andia.mixin.padang.dumai;

import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;

import com.andia.mixin.bekasi.ConsolidatorPath;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.ParserException;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.api.SPointer;
import com.andia.mixin.sleman.model.XExpression;
import com.andia.mixin.sleman.model.XMember;
import com.andia.mixin.sleman.model.XReference;

public class FormulaModifier {

	private FormulaInspector inspector;

	public FormulaModifier(Supervisor supervisor, String formula) throws ParserException {
		inspector = new FormulaInspector(supervisor, formula);
	}

	public int renameReference(ConsolidatorPath path) {
		Map<SPointer, String> pointers = inspector.getMatchPointers(path);
		int renamed = 0;
		for (SPointer pointer : pointers.keySet()) {
			String newName = pointers.get(pointer);
			if (pointer instanceof XReference) {
				XReference reference = (XReference) pointer;
				reference.setName(newName);
				renamed++;
			} else if (pointer instanceof XMember) {
				XMember member = (XMember) pointer;
				XExpression property = member.getProperty();
				if (property instanceof XReference) {
					XReference reference = (XReference) property;
					reference.setName(newName);
					renamed++;
				}
			}
		}
		return renamed;
	}

	public void inusedReference(ConsolidatorPath path, Set<Object> users) {
		Map<SPointer, String> pointers = inspector.getMatchPointers(path);
		for (SPointer pointer : pointers.keySet()) {
			if (pointer instanceof XReference) {
				if (!users.contains(pointer)) {
					users.add(pointer);
				}
			} else if (pointer instanceof XMember) {
				XMember member = (XMember) pointer;
				XExpression property = member.getProperty();
				if (property instanceof XReference) {
					if (!users.contains(property)) {
						users.add(property);
					}
				}
			}
		}
	}

	public void commit(Consumer<String> consumer) {
		SExpression expression = inspector.getExpression();
		String formula = expression.toLiteral();
		consumer.accept("=" + formula);
	}

}
