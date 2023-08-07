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
package com.andia.mixin.padang.dumai.outset;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.ConsolidatorPath;
import com.andia.mixin.bekasi.ConsolidatorTarget;
import com.andia.mixin.padang.dumai.FormulaModifier;
import com.andia.mixin.padang.dumai.FormulaParser;
import com.andia.mixin.padang.dumai.FormulaRectification;
import com.andia.mixin.padang.dumai.anchors.TransmutationAnchor;
import com.andia.mixin.padang.outset.OptionOutset;
import com.andia.mixin.rmo.Lifetime;
import com.andia.mixin.rmo.Rectification;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;

public class ProminerOptionOutset implements OptionOutset, Lifetime, ConsolidatorTarget {

	private static Logger logger = LoggerFactory.getLogger(ProminerOptionOutset.class);

	private String name;
	private String formula;
	private Supervisor supervisor;
	private TransmutationAnchor transmutation;

	public ProminerOptionOutset(Supervisor supervisor) {
		this.supervisor = supervisor;
		assignTransmutationAnchor();
	}

	private void assignTransmutationAnchor() {
		transmutation = supervisor.getPreparedObject(TransmutationAnchor.class);
	}

	@Override
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public void setFormula(String formula) {
		if (this.formula != null) {
			try {
				FormulaParser parser = new FormulaParser();
				SExpression value = parser.parse(formula);
				transmutation.setOption(name, value);
			} catch (Exception e) {
				logger.error("Fail set formula for option '" + name + "'", e);
			}
		}
		this.formula = formula;
	}

	@Override
	public void initiate() {
		try {
			FormulaParser parser = new FormulaParser();
			SExpression value = parser.parse(formula);
			transmutation.setOption(name, value);
		} catch (Exception e) {
			logger.error("Fail initiate formula for option '" + name + "'", e);
		}
	}

	@Override
	public void activate() {

	}

	@Override
	public void referencePointed(ConsolidatorPath path, Set<Object> users) {
		try {
			FormulaModifier modifier = new FormulaModifier(supervisor, formula);
			modifier.inusedReference(path, users);
		} catch (Exception e) {
			logger.error("Fail check used reference options '" + name + "'", e);
		}
	}

	@Override
	public void referenceRenamed(ConsolidatorPath path) {
		try {
			FormulaModifier modifier = new FormulaModifier(supervisor, formula);
			int reference = modifier.renameReference(path);
			if (reference > 0) {
				modifier.commit((formula) -> {
					Rectification rectification = new FormulaRectification(formula);
					supervisor.submit(rectification);
				});
			}
		} catch (Exception e) {
			logger.error("Fail rename reference option '" + name + "'", e);
		}
	}

	@Override
	public void terminate() {
		try {
			transmutation.removeOption(name);
		} catch (Exception e) {
			logger.error("Fail remove reference option '" + name + "'", e);
		}
	}

}
