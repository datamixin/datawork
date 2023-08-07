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
package com.andia.mixin.base;

import com.andia.mixin.value.MixinColumnMetadata;

public abstract class BaseColumnMetadata implements MixinColumnMetadata {

	private int valueCount = 0;
	private int nullCount = 0;
	private int errorCount = 0;
	private Object minValue;
	private Object maxValue;

	public BaseColumnMetadata() {

	}

	public BaseColumnMetadata(MixinColumnMetadata metadata) {
		valueCount = metadata.getValueCount();
		nullCount = metadata.getNullCount();
		errorCount = metadata.getErrorCount();
	}

	public void incrementValue() {
		valueCount++;
	}

	@Override
	public int getValueCount() {
		return valueCount;
	}

	public void incrementNull() {
		nullCount++;
	}

	@Override
	public int getNullCount() {
		return nullCount;
	}

	@Override
	public int getErrorCount() {
		return errorCount;
	}

	public void incrementError() {
		errorCount++;
	}

	public Object getMinValue() {
		return minValue;
	}

	public void acceptMinValue(Object newValue) {
		if (minValue == null) {
			minValue = newValue;
		} else if (minValue instanceof Number && newValue instanceof Number) {
			Number thisMin = (Number) minValue;
			Number thatMin = (Number) newValue;
			double thisValue = thisMin.doubleValue();
			double thatValue = thatMin.doubleValue();
			if (thisValue > thatValue) {
				minValue = newValue;
			}
		} else {
			String thisMin = String.valueOf(minValue);
			String thatMin = String.valueOf(newValue);
			if (thisMin.compareTo(thatMin) > 0) {
				minValue = newValue;
			}
		}
	}

	public Object getMaxValue() {
		return maxValue;
	}

	public void acceptMaxValue(Object newValue) {
		if (maxValue == null) {
			maxValue = newValue;
		} else if (maxValue instanceof Number && newValue instanceof Number) {
			Number thisMax = (Number) maxValue;
			Number thatMax = (Number) newValue;
			double thisValue = thisMax.doubleValue();
			double thatValue = thatMax.doubleValue();
			if (thisValue < thatValue) {
				maxValue = newValue;
			}
		} else {
			String thisMin = String.valueOf(maxValue);
			String thatMin = String.valueOf(newValue);
			if (thisMin.compareTo(thatMin) < 0) {
				maxValue = newValue;
			}
		}
	}

}
