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
package com.andia.mixin.padang.model;

import com.andia.mixin.model.BasicEMap;
import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EMap;
import com.andia.mixin.model.EReference;

public class XDataset extends XReceipt {

	public static String XCLASSNAME = Padang.getEClassName("XDataset");

	public static EReference FEATURE_SOURCE = new EReference("source", XSource.class);
	public static EReference FEATURE_DISPLAY = new EReference("display", XDisplay.class);
	public static EReference FEATURE_RESERVE = new EReference("reserve", XReserve.class);
	public static EAttribute FEATURE_PROPERTIES = new EAttribute("properties", EAttribute.STRING);

	private XSource source = null;
	private XDisplay display = null;
	private XReserve reserve = null;
	private EMap<String> properties = new BasicEMap<String>(this, XDataset.FEATURE_PROPERTIES);

	public XDataset() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XDataset.FEATURE_SOURCE,
				XDataset.FEATURE_DISPLAY,
				XDataset.FEATURE_RESERVE,
				XDataset.FEATURE_PROPERTIES,
		});
	}

	public XSource getSource() {
		return source;
	}

	public void setSource(XSource newSource) {
		XSource oldSource = this.source;
		this.source = newSource;
		this.eSetNotify(XDataset.FEATURE_SOURCE, oldSource, newSource);
	}

	public XDisplay getDisplay() {
		return display;
	}

	public void setDisplay(XDisplay newDisplay) {
		XDisplay oldDisplay = this.display;
		this.display = newDisplay;
		this.eSetNotify(XDataset.FEATURE_DISPLAY, oldDisplay, newDisplay);
	}

	public XReserve getReserve() {
		return reserve;
	}

	public void setReserve(XReserve newReserve) {
		XReserve oldReserve = this.reserve;
		this.reserve = newReserve;
		this.eSetNotify(XDataset.FEATURE_RESERVE, oldReserve, newReserve);
	}

	public EMap<String> getProperties() {
		return properties;
	}

}
