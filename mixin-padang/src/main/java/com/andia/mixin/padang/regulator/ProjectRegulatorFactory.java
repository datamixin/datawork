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
package com.andia.mixin.padang.regulator;

import com.andia.mixin.padang.model.XBuilder;
import com.andia.mixin.padang.model.XCell;
import com.andia.mixin.padang.model.XDataset;
import com.andia.mixin.padang.model.XFigure;
import com.andia.mixin.padang.model.XGraphic;
import com.andia.mixin.padang.model.XIngestion;
import com.andia.mixin.padang.model.XInput;
import com.andia.mixin.padang.model.XMixture;
import com.andia.mixin.padang.model.XMutation;
import com.andia.mixin.padang.model.XOption;
import com.andia.mixin.padang.model.XOutcome;
import com.andia.mixin.padang.model.XOutlook;
import com.andia.mixin.padang.model.XPreparation;
import com.andia.mixin.padang.model.XProject;
import com.andia.mixin.padang.model.XSheet;
import com.andia.mixin.padang.model.XTabular;
import com.andia.mixin.padang.model.XVariable;
import com.andia.mixin.padang.model.XViewset;
import com.andia.mixin.rmo.BaseRegulatorFactory;
import com.andia.mixin.rmo.EListRegulator;

public class ProjectRegulatorFactory extends BaseRegulatorFactory {

	public ProjectRegulatorFactory() {
		super();

		// EObject
		register(XCell.XCLASSNAME, CellRegulator.class);
		register(XInput.XCLASSNAME, InputRegulator.class);
		register(XSheet.XCLASSNAME, SheetRegulator.class);
		register(XOption.XCLASSNAME, OptionRegulator.class);
		register(XFigure.XCLASSNAME, FigureRegulator.class);
		register(XBuilder.XCLASSNAME, BuilderRegulator.class);
		register(XOutcome.XCLASSNAME, OutcomeRegulator.class);
		register(XOutlook.XCLASSNAME, OutlookRegulator.class);
		register(XMixture.XCLASSNAME, MixtureRegulator.class);
		register(XProject.XCLASSNAME, ProjectRegulator.class);
		register(XDataset.XCLASSNAME, DatasetRegulator.class);
		register(XGraphic.XCLASSNAME, GraphicRegulator.class);
		register(XViewset.XCLASSNAME, ViewsetRegulator.class);
		register(XTabular.XCLASSNAME, TabularRegulator.class);
		register(XMutation.XCLASSNAME, MutationRegulator.class);
		register(XVariable.XCLASSNAME, VariableRegulator.class);
		register(XIngestion.XCLASSNAME, IngestionRegulator.class);
		register(XPreparation.XCLASSNAME, PreparationRegulator.class);

		// EList
		registerList(XMixture.XCLASSNAME, XMixture.FEATURE_PARTS, EListRegulator.class);
		registerList(XDataset.XCLASSNAME, XDataset.FEATURE_INPUTS, EListRegulator.class);
		registerList(XProject.XCLASSNAME, XProject.FEATURE_SHEETS, EListRegulator.class);
		registerList(XBuilder.XCLASSNAME, XBuilder.FEATURE_VARIABLES, EListRegulator.class);
		registerList(XGraphic.XCLASSNAME, XGraphic.FEATURE_VARIABLES, EListRegulator.class);
		registerList(XTabular.XCLASSNAME, XTabular.FEATURE_MUTATIONS, EListRegulator.class);
		registerList(XMutation.XCLASSNAME, XMutation.FEATURE_OPTIONS, EListRegulator.class);
		registerList(XPreparation.XCLASSNAME, XPreparation.FEATURE_MUTATIONS, EListRegulator.class);

	}
}
