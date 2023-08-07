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

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import com.andia.mixin.outset.NodeOutset;
import com.andia.mixin.regulator.NodeRegulator;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class BaseOutsetListTest {

	private static BaseOutsetList<NodeOutset> list = new BaseOutsetList<>();
	private static NodeOutset firstOutset = new NodeOutset(new NodeRegulator());
	private static NodeOutset secondOutset = new NodeOutset(new NodeRegulator());

	@Test
	@Order(00)
	public void testAdd() {
		list.add(firstOutset, 0);
	}

	@Test
	@Order(10)
	public void testIndexOf() {
		assertEquals(0, list.indexOf(firstOutset));

	}

	@Test
	@Order(20)
	public void testMove() {
		list.add(secondOutset, 1);
		list.move(secondOutset, 0);
	}

	@Test
	@Order(30)
	public void testGet() {
		Outset outset = list.get(0);
		assertEquals(secondOutset, outset);
	}

	@Test
	@Order(40)
	public void testSize() {
		assertEquals(2, list.size());
	}

	@Test
	@Order(50)
	public void remove() {
		boolean remove = list.remove(secondOutset);
		assertEquals(true, remove);
		assertEquals(1, list.size());
	}
}
