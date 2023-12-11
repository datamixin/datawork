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
import Point from "webface/graphics/Point";

import VisageTable from "bekasi/visage/VisageTable";

import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";

import * as  rinjani from "rinjani/rinjani";

import Plot from "rinjani/directors/plots/Plot";

export abstract class MatrixPlot extends Plot {

	public static X = "x";
	public static Y = "y";
	public static VALUE = "value";
	public static LABEL = "label";
	public static STEP = 40;

	protected createMatrix(table: VisageTable, size: Point,
		label: string, value: string, width: number, height: number): XTopLevelLayerSpec {

		// Layer
		let layerSpec = this.maker.createTopLevelLayerSpec();
		this.maker.adjustSize(layerSpec, size);
		this.maker.setWidthEqualHeight(layerSpec);
		layerSpec.setWidth(width);
		layerSpec.setHeight(height);
		this.maker.setCSVDatasetFromTable(layerSpec, table);

		// X
		let x = this.maker.addXFieldDef(layerSpec, MatrixPlot.X);
		this.maker.setFieldTitleNull(x);
		this.maker.setFieldSortNull(x);

		// Y
		let y = this.maker.addYFieldDef(layerSpec, MatrixPlot.Y);
		this.maker.setFieldTitleNull(y);

		// Rect Color
		let rectLayer = this.maker.addRectUnitSpecLayer(layerSpec);
		let color = this.maker.addColorFieldDef(rectLayer, value);
		this.maker.setFieldTypeQuantitative(color);
		this.maker.setFieldScaleRangeDomain(color, rinjani.WHITE_RED, 0, 1);

		// Text
		let textLayer = this.maker.addTextUnitSpecLayer(layerSpec);
		this.maker.addTextFieldDef(textLayer, label);

		return layerSpec;

	}

}

export default MatrixPlot;