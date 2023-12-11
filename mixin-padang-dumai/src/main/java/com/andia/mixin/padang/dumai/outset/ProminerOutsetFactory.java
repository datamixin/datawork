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
package com.andia.mixin.padang.dumai.outset;

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
import com.andia.mixin.rmo.BaseOutsetFactory;
import com.andia.mixin.rmo.BaseOutsetList;

public class ProminerOutsetFactory extends BaseOutsetFactory {

	public ProminerOutsetFactory() {
		super();

		// EObject
		register(XCell.XCLASSNAME, ProminerCellOutset.class);
		register(XSheet.XCLASSNAME, ProminerSheetOutset.class);
		register(XInput.XCLASSNAME, ProminerInputOutset.class);
		register(XOption.XCLASSNAME, ProminerOptionOutset.class);
		register(XFigure.XCLASSNAME, ProminerFigureOutset.class);
		register(XOutcome.XCLASSNAME, ProminerOutcomeOutset.class);
		register(XOutlook.XCLASSNAME, ProminerOutlookOutset.class);
		register(XProject.XCLASSNAME, ProminerProjectOutset.class);
		register(XDataset.XCLASSNAME, ProminerDatasetOutset.class);
		register(XViewset.XCLASSNAME, ProminerViewsetOutset.class);
		register(XTabular.XCLASSNAME, ProminerTabularOutset.class);
		register(XMixture.XCLASSNAME, ProminerMixtureOutset.class);
		register(XBuilder.XCLASSNAME, ProminerBuilderOutset.class);
		register(XGraphic.XCLASSNAME, ProminerGraphicOutset.class);
		register(XVariable.XCLASSNAME, ProminerVariableOutset.class);
		register(XMutation.XCLASSNAME, ProminerMutationOutset.class);
		register(XIngestion.XCLASSNAME, ProminerIngestionOutset.class);
		register(XPreparation.XCLASSNAME, ProminerPreparationOutset.class);

		// EList
		registerList(XMixture.XCLASSNAME, XMixture.FEATURE_PARTS, BaseOutsetList.class);
		registerList(XDataset.XCLASSNAME, XDataset.FEATURE_INPUTS, BaseOutsetList.class);
		registerList(XProject.XCLASSNAME, XProject.FEATURE_SHEETS, BaseOutsetList.class);
		registerList(XBuilder.XCLASSNAME, XBuilder.FEATURE_VARIABLES, BaseOutsetList.class);
		registerList(XGraphic.XCLASSNAME, XGraphic.FEATURE_VARIABLES, BaseOutsetList.class);
		registerList(XTabular.XCLASSNAME, XTabular.FEATURE_MUTATIONS, BaseOutsetList.class);
		registerList(XMutation.XCLASSNAME, XMutation.FEATURE_OPTIONS, BaseOutsetList.class);
		registerList(XPreparation.XCLASSNAME, XPreparation.FEATURE_MUTATIONS, ProminerMutationOutsetList.class);

	}
}
