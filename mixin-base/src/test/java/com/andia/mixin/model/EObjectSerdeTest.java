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
package com.andia.mixin.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.andia.mixin.rmo.MockFactoryUtil;

public class EObjectSerdeTest {

	private static String json;

	private static EPackage registry = MockPackage.eINSTANCE;
	private static EObjectSerde<MGraph> serde = new EObjectSerde<>(registry);

	private static MGraph graph = MockFactoryUtil.createMGraph();

	static {
		graph.setType("dag");
		MockFactory factory = MockFactory.eINSTANCE;

		MValue mark = graph.getMark();
		MFlag flag = mark.getFlag();
		EList<String> labels = flag.getLabels();
		labels.add("first");

		MNode node = factory.createMNode();
		EMap<MValue> styles = node.getStyles();
		MValue value = factory.createMValue();
		value.setExpression("expression");
		styles.put("value", value);

	}

	@BeforeAll
	public static void setup() throws EObjectSerdeException {

		System.setProperty("line.separator", "\n");
		String newLine = System.getProperty("line.separator");

		json = newLine +
				"{" + newLine +
				"    \"ns\": [" + newLine +
				"        {" + newLine +
				"            \"prefix\": \"mock\"," + newLine +
				"            \"uri\": \"http://www.andiasoft.com/model/mixin/mock\"" + newLine +
				"        }" + newLine +
				"    ]," + newLine +
				"    \"eClass\": \"mock:MGraph\"," + newLine +
				"    \"type\": \"dag\"," + newLine +
				"    \"mark\": {" + newLine +
				"        \"expression\": null," + newLine +
				"        \"flag\": {" + newLine +
				"            \"labels\": [" + newLine +
				"                \"first\"" + newLine +
				"            ]" + newLine +
				"        }" + newLine +
				"    }," + newLine +
				"    \"nodes\": [" + newLine +
				"    ]," + newLine +
				"    \"edges\": [" + newLine +
				"    ]" + newLine +
				"}";
	}

	@Test
	public void testSerialize() throws EObjectSerdeException {
		String serialize = serde.serialize(graph);
		assertEquals(json, serialize);
	}

	@Test
	public void testDeserialize() throws EObjectSerdeException {
		MGraph deserialize = serde.deserialize(json);
		assertTrue(EUtils.isEquals(graph, deserialize));
	}

	@Test
	public void testDeserializeFailFeatureNotFound() {
		String str = "{x}";
		EObjectSerdeException exception = assertThrows(EObjectSerdeException.class, () -> {
			serde.deserialize(str);
		});
		assertEquals("Fail deserialize json", exception.getMessage());
	}

	@Test
	public void testGetPackages() {
		EPackage packages = serde.getEPackage();
		assertEquals(registry, packages);
	}

}
