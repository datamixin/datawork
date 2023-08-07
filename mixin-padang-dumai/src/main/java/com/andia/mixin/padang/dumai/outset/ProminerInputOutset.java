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

import com.andia.mixin.bekasi.Consolidator;
import com.andia.mixin.bekasi.ConsolidatorPath;
import com.andia.mixin.bekasi.ConsolidatorTarget;
import com.andia.mixin.padang.dumai.FormulaModifier;
import com.andia.mixin.padang.dumai.FormulaParser;
import com.andia.mixin.padang.dumai.FormulaRectification;
import com.andia.mixin.padang.dumai.ProminerFormer;
import com.andia.mixin.padang.dumai.anchors.OriginAnchor;
import com.andia.mixin.padang.dumai.anchors.ReceiptAnchor;
import com.andia.mixin.padang.dumai.anchors.ViewsetAnchor;
import com.andia.mixin.padang.outset.InputOutset;
import com.andia.mixin.rmo.Lifetime;
import com.andia.mixin.rmo.Rectification;
import com.andia.mixin.rmo.Supervisor;
import com.andia.mixin.sleman.api.SExpression;

public class ProminerInputOutset implements InputOutset, Lifetime, ConsolidatorTarget {

	private static Logger logger = LoggerFactory.getLogger(ProminerInputOutset.class);

	private Supervisor supervisor;
	private Consolidator consolidation;
	private ProminerFormer origin;
	private ReceiptAnchor receipt;
	private String name;
	private String value;

	public ProminerInputOutset(Supervisor supervisor) {
		this.supervisor = supervisor;
		assignConsolidation();
		assignReceiptAnchor();
		preparePath();
	}

	private void assignConsolidation() {
		consolidation = supervisor.getCapability(Consolidator.class);
	}

	private void assignReceiptAnchor() {
		receipt = supervisor.getPreparedObject(ReceiptAnchor.class);
	}

	private void preparePath() {
		Supervisor parent = supervisor.getParent();
		OriginAnchor anchor = parent.getPreparedObject(OriginAnchor.class);
		origin = new ProminerFormer(supervisor, anchor);
	}

	@Override
	public void setName(String name) {
		origin.setName(name);
		if (this.name != null) {
			try {
				receipt.renameInput(this.name, name);
				consolidation.referenceRenamed(origin);
			} catch (Exception e) {
				logger.error("Fail set input '" + name + "'", e);
			}
		}
		origin.updatePath();
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public boolean isUnderResult() {
		Supervisor parent = supervisor.getParent();
		OriginAnchor anchor = parent.getCapability(OriginAnchor.class);
		return anchor instanceof ViewsetAnchor;
	}

	@Override
	public void setValue(String value) {
		if (this.value != null) {
			assignInput();
		}
		this.value = value;
	}

	@Override
	public void initiate() {
		assignInput();
	}

	private void assignInput() {
		try {
			FormulaParser parser = new FormulaParser();
			SExpression expression = parser.parse(value);
			receipt.assignInput(name, expression);
		} catch (Exception e) {
			logger.error("Fail assign input '" + name + "'", e);
		}
	}

	@Override
	public void activate() {
	}

	@Override
	public void referencePointed(ConsolidatorPath path, Set<Object> users) {
		try {
			FormulaModifier modifier = new FormulaModifier(supervisor, value);
			modifier.inusedReference(path, users);
		} catch (Exception e) {
			logger.error("Fail check used reference input '" + name + "'", e);
		}
	}

	@Override
	public void referenceRenamed(ConsolidatorPath path) {
		try {
			FormulaModifier modifier = new FormulaModifier(supervisor, value);
			int reference = modifier.renameReference(path);
			if (reference > 0) {
				modifier.commit((formula) -> {
					Rectification rectification = new FormulaRectification(formula);
					supervisor.submit(rectification);
				});
			}
		} catch (Exception e) {
			logger.error("Fail rename reference input '" + name + "'", e);
		}
	}

	@Override
	public void terminate() {
		try {
			receipt.removeInput(name);
			consolidation.referenceRemoved(origin);
		} catch (Exception e) {
			logger.error("Fail terminate input '" + name + "'", e);
		}
	}

}
