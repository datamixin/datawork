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
package com.andia.mixin.padang.webface.upload;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UploadFileManager {

	private final static String LOCATION = "uploads.path";
	private final static Logger logger = Logger.getLogger(UploadFileManager.class.getCanonicalName());

	private final File path;

	public UploadFileManager(String userName) {
		String location = System.getProperty(LOCATION);
		if (location == null) {
			location = "./demo/uploads";
		}
		path = new File(location, userName);
		if (!path.exists()) {
			if (!path.mkdirs()) {
				logger.log(Level.SEVERE, "Cannot create upload manager path '{0}'", path);
			}
		}
	}

	public Collection<UploadFile> listFiles() {
		File[] files = path.listFiles();
		List<UploadFile> list = new ArrayList<>();
		for (File file : files) {
			UploadFile item = new UploadFile(file);
			list.add(item);
		}
		return list;
	}

	public boolean remove(String filename) {
		File file = new File(path, filename);
		return file.delete();
	}

	public OutputStream createOutputStream(String fileName) throws FileNotFoundException {
		File file = new File(path, fileName);
		return new FileOutputStream(file);
	}

	public FileInputStream createInputStream(String fileName) throws FileNotFoundException {
		File file = new File(path, fileName);
		return new FileInputStream(file);
	}

}
