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
package com.andia.mixin.bekasi.quarkus.nativebuild;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.annotation.Annotation;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.UUID;
import java.util.function.BiConsumer;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.graalvm.nativeimage.hosted.Feature;
import org.graalvm.nativeimage.hosted.RuntimeReflection;

import com.andia.mixin.Lean;
import com.andia.mixin.jepara.Record;
import com.andia.mixin.model.EObject;
import com.andia.mixin.rmo.Outset;
import com.andia.mixin.rmo.Regulator;
import com.andia.mixin.util.Date;
import com.andia.mixin.util.DateTime;
import com.andia.mixin.util.Elapsed;
import com.andia.mixin.util.Time;
import com.andia.mixin.util.Timestamp;
import com.fasterxml.jackson.databind.ser.std.ClassSerializer;
import com.oracle.svm.core.annotate.AutomaticFeature;

import io.smallrye.jwt.build.impl.JwtProviderImpl;

@AutomaticFeature
public class BaseReflectionRegistrationFeature implements Feature {

	private Set<Class<?>> registeredClasses = new HashSet<>();

	@Override
	public void beforeAnalysis(BeforeAnalysisAccess access) {

		try {

			System.out.println("Registering java reflection classes");

			register(byte[].class);

			register(Byte.class);
			register(Short.class);
			register(Integer.class);
			register(Long.class);
			register(Float.class);
			register(Double.class);
			register(Boolean.class);
			register(Character.class);
			register(String.class);

			register(BigDecimal.class);
			register(BigInteger.class);

			register(HashMap.class);
			register(TreeMap.class);
			register(LinkedHashMap.class);

			register(UUID.class);

			register(java.sql.Blob.class);
			register(java.sql.Clob.class);
			register(java.sql.Timestamp.class);

			register(HashSet.class);
			register(TreeSet.class);
			register(ArrayList.class);
			register(LinkedList.class);

			register(Time.class);
			register(Date.class);
			register(Timestamp.class);
			register(DateTime.class);
			register(Elapsed.class);

			System.out.println("Registering library reflection classes:");
			register(ClassSerializer.class);
			register(JwtProviderImpl.class);

			System.out.println("Registering instantiable reflection classes:");
			registerInstantiables(

					Lean.class,
					EObject.class,

					Outset.class,
					Regulator.class,

					Record.class);

			System.out.println("Registering service provider reflection classes:");
			registerServiceProviders();

		} catch (Exception e) {
			throw new RuntimeException(e);
		} finally {
			System.out.println("Reflection discovery complete!");
		}

	}

	protected void register(Class<?> aClass) {
		if (!registeredClasses.contains(aClass)) {
			System.out.println("\tRegistering " + aClass);
			RuntimeReflection.register(aClass);
			RuntimeReflection.register(aClass.getDeclaredConstructors());
			RuntimeReflection.register(aClass.getConstructors());
			RuntimeReflection.register(aClass.getDeclaredMethods());
			RuntimeReflection.register(aClass.getMethods());
			RuntimeReflection.register(aClass.getDeclaredFields());
			RuntimeReflection.register(aClass.getFields());
			registeredClasses.add(aClass);
		}
	}

	protected void registerInstantiables(Class<?>... classes)
			throws Exception {
		readLibRecursively((file, entry) -> {

			String filterFolder = "com\\andia\\mixin";

			String name = entry.getName();
			name = name.replaceAll("[\\|/]", "\\\\");

			if (name.startsWith(filterFolder)) {
				if (name.endsWith(".class")) {

					String classPath = name.replace('\\', '.');
					int lastDot = classPath.lastIndexOf('.');
					String className = classPath.substring(0, lastDot);
					try {

						Class<?> loadedClass = Class.forName(className);
						for (Class<?> type : classes) {
							if (type.isAssignableFrom(loadedClass)) {

								// Class yang didaftarkan untuk reflection sampai ke Object.class
								Class<?> currentClass = loadedClass;
								while (currentClass != Object.class) {

									// Register current class
									register(currentClass);

									// Register all annotations
									Annotation[] annotations = currentClass.getDeclaredAnnotations();
									for (Annotation annotation : annotations) {
										Class<?> aType = annotation.annotationType();
										register(aType);
									}
									currentClass = currentClass.getSuperclass();
									if (currentClass == null) {
										break;
									}
								}
								break;
							}
						}

					} catch (Exception e) {
						throw new RuntimeException(e);
					}
				}
			}
		});
	}

	protected void registerServiceProviders() throws Exception {
		readLibRecursively((file, entry) -> {
			String services = "META-INF\\services";

			String entryName = entry.getName();
			entryName = entryName.replaceAll("[\\|/]", "\\\\");
			if (entryName.startsWith(services)) {
				if (entryName.indexOf("com.andia.mixin") > -1) {
					try (InputStream inputStream = file.getInputStream(entry);
							InputStreamReader streamReader = new InputStreamReader(inputStream);
							BufferedReader reader = new BufferedReader(streamReader)) {
						String line = null;
						while ((line = reader.readLine()) != null) {
							if (line.indexOf('.') > 0) {

								// Baca service provider classname
								Class<?> loadedClass = Class.forName(line);
								register(loadedClass);
							}
						}
					} catch (Exception e) {
						throw new RuntimeException(e);
					}
				}
			}
		});
	}

	private static void readLibRecursively(BiConsumer<ZipFile, ZipEntry> consumer) throws Exception {

		ClassLoader loader = BaseReflectionRegistrationFeature.class.getClassLoader();
		URL url = loader.getResource("./");
		String path = URLDecoder.decode(url.getPath(), "utf-8");
		File workDir = new File(path);
		if (!workDir.exists()) {
			throw new RuntimeException("Root dir: " + workDir.getAbsolutePath() + " isn't exists!");
		}

		System.out.println("Root dir: " + workDir.getAbsolutePath());
		readAndiaDirAtFatJarRecursively(workDir, consumer);
	}

	private static void readAndiaDirAtFatJarRecursively(File source, BiConsumer<ZipFile, ZipEntry> consumer)
			throws Exception {

		File workDir = new File(source.getAbsolutePath());
		if (workDir.exists()) {

			// List work files
			for (File libFile : workDir.listFiles()) {
				if (libFile.isFile()) {
					String name = libFile.getName();
					if (!name.endsWith(".jar")) {
						continue;
					}
					ZipFile zipFile = null;
					try {
						zipFile = new ZipFile(libFile);
						Enumeration<? extends ZipEntry> entries = zipFile.entries();
						while (entries.hasMoreElements()) {
							ZipEntry entry = entries.nextElement();
							if (!entry.isDirectory()) { //
								consumer.accept(zipFile, entry);
							}
						}
					} finally {
						if (zipFile != null) {
							zipFile.close();
						}
					}
				} else {
					readAndiaDirAtFatJarRecursively(libFile, consumer);
				}
			}

		}
	}

}
