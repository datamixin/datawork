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
import * as util from "webface/model/util";

import Point from "webface/graphics/Point";

import BuilderPremise from "padang/ui/BuilderPremise";

import * as directors from "malang/directors";

import XModeler from "malang/model/XModeler";
import XInputFeature from "malang/model/XInputFeature";

import PreloadPanel from "malang/panels/PreloadPanel";

import Preload from "malang/directors/preloads/Preload";
import PreloadSupport from "malang/directors/preloads/PreloadSupport";
import PreloadRegistry from "malang/directors/preloads/PreloadRegistry";

import BuilderPartViewer from "malang/ui/BuilderPartViewer";

import OutputPartSupport from "malang/directors/OutputPartSupport";
import ExposePartDirector from "malang/directors/ExposePartDirector";

import ModelerExposeController from "malang/controller/expose/ModelerExposeController";

export default class BaseExposePartDirector implements ExposePartDirector, PreloadSupport {

	private viewer: BuilderPartViewer = null;
	private premise: BuilderPremise = null;
	private support: OutputPartSupport = null;
	private featureTypes = new Map<XInputFeature, string>();

	constructor(viewer: BuilderPartViewer, premise: BuilderPremise) {
		this.viewer = viewer;
		this.premise = premise;
		this.support = new OutputPartSupport(premise);
	}

	public getPremise(): BuilderPremise {
		return this.premise;
	}

	private getModelerController(): ModelerExposeController {
		let rootController = this.viewer.getRootController();
		return <ModelerExposeController>rootController.getContents();;
	}

	private getModel(): XModeler {
		let controller = this.getModelerController();
		return <XModeler>controller.getModel();
	}

	public listPreloads(model: XModeler, callback: (preloads: Preload[]) => void): void {

		this.featureTypes.clear();
		let features = <XInputFeature[]>util.getDescendantsByModelClass(model, XInputFeature);
		for (let feature of features) {
			let formula = feature.getValue();

			let director = directors.getOutputPartDirector(this.viewer);
			director.getBuilderResultBriefType(formula, (type: string): void => {

				this.featureTypes.set(feature, type);

				if (this.featureTypes.size === features.length) {
					let registry = PreloadRegistry.getInstance();
					let preloads: Preload[] = [];
					let candidates = registry.list();
					for (let candidate of candidates) {
						if (candidate.isApplicable(this, model)) {
							preloads.push(candidate);
						}
					}
					preloads.sort((a: Preload, b: Preload) => {
						let aSequence = a.getSequence();
						let bSequence = b.getSequence();
						return aSequence - bSequence;
					});
					callback(preloads);
				}
			});
		}
	}

	public getFeatureType(feature: XInputFeature): string {
		return this.featureTypes.get(feature);
	}

	public getPreload(name: string): Preload {
		let registry = PreloadRegistry.getInstance();
		return registry.get(name);
	}

	public loadPreloadResult(name: string, size: Point, callback: (panel: PreloadPanel) => void): void {
		let model = this.getModel();
		this.support.getPreloadResult(name, model, size, callback);
	}

}