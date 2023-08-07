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
package com.andia.mixin.bekasi.reformer;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.StringReader;
import java.util.Collection;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.json.JsonWriter;
import javax.json.stream.JsonParser;
import javax.json.stream.JsonParser.Event;

public class ReformerEffector {

	private static final String VERSION = "version";
	private static final int DEFAULT_VERSION = 0;

	private ReformerRegistry registry;

	protected ReformerEffector(ReformerRegistry registry) {
		this.registry = registry;
	}

	public int readVersion(String model) {
		StringReader reader = new StringReader(model);
		int version = DEFAULT_VERSION;
		try (JsonParser parser = Json.createParser(reader)) {
			Event next = parser.next();
			while (next == Event.START_OBJECT) {
				next = parser.next();
				while (next == Event.KEY_NAME) {
					String string = parser.getString();
					if (string.equals(VERSION)) {
						Event versionValueEvent = parser.next();
						if (versionValueEvent == Event.VALUE_NUMBER) {
							return parser.getInt();
						}
					} else {
						next = parser.next();
						if (next == Event.START_OBJECT) {
							parser.skipObject();
						} else if (next == Event.START_ARRAY) {
							parser.skipArray();
						}
						next = parser.next();
					}
				}
			}
		}
		return version;
	}

	public boolean willReform(String model) {
		if (model != null) {
			int version = readVersion(model);
			int count = registry.getVersions();
			if (count > 0) {
				int latest = registry.getLatestVersion();
				return version < latest;
			}
		}
		return false;
	}

	public String reform(String model) {

		// Baca object sebagai json
		byte[] input = model.getBytes();
		ByteArrayInputStream inputStream = new ByteArrayInputStream(input);
		JsonReader reader = Json.createReader(inputStream);
		JsonObject object = reader.readObject();

		// Lakukan reform model sesuai urutan
		int current = object.getInt(VERSION, 0);
		Collection<Reformer> reformers = registry.getReformerSequence(current);
		for (Reformer reformer : reformers) {
			JsonObjectBuilder builder = Json.createObjectBuilder();
			int version = reformer.getVersion();
			reformer.reform(object, builder);
			builder.add(VERSION, version);
			object = builder.build();
		}

		// Object write
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		JsonWriter writer = Json.createWriter(outputStream);
		writer.write(object);
		byte[] output = outputStream.toByteArray();
		return new String(output);
	}

}
