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
package com.andia.mixin.rmo;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class RootRegulator extends Regulator {

	private Regulator contents;
	private Runmodel runmodel;

	@Override
	protected RootOutset createOutset() {
		return new RootOutset();
	}

	@Override
	public Runmodel getRunmodel() {
		return this.runmodel;
	}

	public void setRunmodel(Runmodel runmodel) {
		this.runmodel = runmodel;
	}

	@Override
	protected RootRegulator getRoot() {
		return this;
	}

	/**
	 * Regulator yang diberikan harus sudah memiliki model dan
	 * {@link RegulatorFactory} serta {@link OutsetFactory} harus sudah siap di
	 * {@link Runmodel}.<br>
	 * {@link Runmodel} harus sudah diberikan melalui
	 * {@link #setRunmodel(Runmodel)}.
	 * 
	 * @param contents
	 */
	public void setContents(Regulator contents) {

		// Hapus terlebih dahulu yang sebelumnya jika ada
		if (this.contents != null) {
			this.removeChild(this.contents);
		}

		// Setting contents baru
		this.contents = contents;
		if (this.contents != null) {
			this.addChild(this.contents, 0);
			this.contents.activate();
		}
	}

	public Regulator getContents() {
		return contents;
	}

	@Override
	public void update() {
		this.contents.update();
	}

	public List<Regulator> getChildren() {
		if (this.contents == null)
			return Collections.emptyList();
		return Arrays.asList(this.contents);
	}

	@Override
	public String getQualifiedPath() {
		return "";
	}

	@Override
	public FeatureKey[] getFeatureKeys() {
		return new FeatureKey[] {};
	}

}
