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

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.json.JsonWriter;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.andia.mixin.lawang.SecuritySetting;

@MultipartConfig
@WebServlet(urlPatterns = { UploadFileServlet.ALIAS + "/*" })
public class UploadFileServlet extends HttpServlet {

	public final static String ALIAS = "/uploads";
	public final static String FILENAME = "filename";

	private static final long serialVersionUID = 8391594819862947774L;

	private final static Logger logger = Logger.getLogger(UploadFileServlet.class.getCanonicalName());

	private UploadFileManager manager;

	@Inject
	public void setSetting(SecuritySetting setting) {
		String username = setting.getUserId();
		this.manager = new UploadFileManager(username);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String uri = request.getRequestURI();
		if (uri.equals(ALIAS)) {
			PrintWriter writer = response.getWriter();
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			Collection<UploadFile> files = manager.listFiles();
			JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
			for (UploadFile file : files) {
				JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
				objectBuilder.add("name", file.getName());
				objectBuilder.add("modified", file.getModified());
				objectBuilder.add("size", file.getSize());
				arrayBuilder.add(objectBuilder);
			}
			JsonWriter jsonWriter = Json.createWriter(writer);
			jsonWriter.write(arrayBuilder.build());
			writer.flush();
		} else {
			String filename = getFilename(request);
			FileInputStream inputStream = null;
			ServletOutputStream outputStream = null;
			try {
				inputStream = manager.createInputStream(filename);
				response.setContentType("text/plain");
				response.setHeader("Content-Disposition", "attachment;filename=" + filename);
				outputStream = response.getOutputStream();
				byte[] bytes = new byte[4096];
				int count;
				while ((count = inputStream.read(bytes)) != -1) {
					outputStream.write(bytes, 0, count);
				}
				outputStream.flush();
			} catch (Exception e) {
				logger.log(Level.SEVERE, "Problems during file download. Error: {0}", e.getMessage());
			} finally {
				if (inputStream != null) {
					inputStream.close();
				}
				if (outputStream != null) {
					outputStream.close();
				}
			}
		}
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("application/json");

		// Create path components to save the file
		Part filePart = request.getPart("file");
		String partHeader = filePart.getHeader("content-disposition");
		logger.log(Level.INFO, "Part Header = {0}", partHeader);
		String fileName = null;
		for (String content : partHeader.split(";")) {
			if (content.trim().startsWith(FILENAME)) {
				String value = content.substring(content.indexOf('=') + 1);
				fileName = value.trim().replace("\"", "");
			}
		}
		if (fileName == null) {
			logger.log(Level.WARNING, "File upload {0}", fileName);
			return;
		}

		OutputStream outputStream = null;
		InputStream fileContent = null;
		final PrintWriter writer = response.getWriter();

		try {
			outputStream = manager.createOutputStream(fileName);
			fileContent = filePart.getInputStream();

			int read = 0;
			int size = 0;
			final byte[] bytes = new byte[1024];

			while ((read = fileContent.read(bytes)) != -1) {
				outputStream.write(bytes, 0, read);
				size += read;
			}
			writer.println("{\"files\": {\"name\": \"" + fileName + "\", \"size\": " + size + "}}");
			logger.log(Level.INFO, "File {0} being uploaded", new Object[] { fileName });
		} catch (FileNotFoundException fne) {
			writer.println("You either did not specify a file to upload or are "
					+ "trying to upload a file to a protected or nonexistent " + "location.");
			writer.println("<br/> ERROR: " + fne.getMessage());
			logger.log(Level.SEVERE, "Problems during file upload. Error: {0}", fne.getMessage());
		} finally {
			if (outputStream != null) {
				outputStream.close();
			}
			if (fileContent != null) {
				fileContent.close();
			}
			if (writer != null) {
				writer.close();
			}

			// Hapus MultiPart* part dari upload folder setelah semua dibaca
			if (filePart != null) {
				filePart.delete();
			}
		}
	}

	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException {
		String filename = getFilename(request);
		boolean removed = manager.remove(filename);
		PrintWriter writer = response.getWriter();
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		JsonObjectBuilder builder = Json.createObjectBuilder();
		builder.add("removed", removed);
		JsonWriter jsonWriter = Json.createWriter(writer);
		jsonWriter.write(builder.build());
		writer.flush();
	}

	private String getFilename(HttpServletRequest request) {
		int length = ALIAS.length();
		String uri = request.getRequestURI();
		String filename = uri.substring(length);
		return filename;
	}

}
