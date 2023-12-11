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
package com.andia.mixin.util;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.andia.mixin.value.MixinType;

public class SizeCalculatorTest {

	private SizeCalculator calculator = new SizeCalculator();

	@Test
	public void testEstimateJavaLang() {
		assertEquals(1, calculator.calculate(null));
		assertEquals(4, calculator.calculate("1234"));
		assertEquals(Byte.BYTES, calculator.calculate((byte) 1));
		assertEquals(Byte.BYTES, calculator.calculate(new Byte((byte) 1)));
		assertEquals(Short.BYTES, calculator.calculate((short) 1));
		assertEquals(Short.BYTES, calculator.calculate(new Short((short) 1)));
		assertEquals(Integer.BYTES, calculator.calculate(1));
		assertEquals(Integer.BYTES, calculator.calculate(new Integer(1)));
		assertEquals(Long.BYTES, calculator.calculate(1l));
		assertEquals(Long.BYTES, calculator.calculate(new Long(1l)));
		assertEquals(Float.BYTES, calculator.calculate(1f));
		assertEquals(Float.BYTES, calculator.calculate(new Float(1f)));
		assertEquals(Double.BYTES, calculator.calculate(1d));
		assertEquals(Double.BYTES, calculator.calculate(new Double(1d)));
		assertEquals(Character.BYTES, calculator.calculate('c'));
		assertEquals(Character.BYTES, calculator.calculate(new Character('c')));
	}

	@Test
	public void testEstimateList() {
		List<String> list = Arrays.asList("Jon");
		assertEquals(3, calculator.calculate(list));
	}

	@Test
	public void testEstimateMap() {
		Map<String, String> map = new HashMap<>();
		map.put("name", "Jon");
		assertEquals(7, calculator.calculate(map));
	}

	@Test
	public void testEstimateArray() {
		String[] names = { "Jon", "Andika" };
		assertEquals(9, calculator.calculate(names));
	}

	@Test
	public void testEstimateEnum() {
		Object type = MixinType.STRING;
		assertEquals(4, calculator.calculate(type));
	}

}
