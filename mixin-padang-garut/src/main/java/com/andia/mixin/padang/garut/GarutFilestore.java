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
package com.andia.mixin.padang.garut;

import java.util.UUID;

import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.inject.Singleton;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.Runextra;
import com.andia.mixin.bekasi.Runserver;
import com.andia.mixin.bekasi.Runspace;
import com.andia.mixin.bekasi.base.BaseRunserver;
import com.andia.mixin.lawang.SecuritySetting;
import com.andia.mixin.model.EList;
import com.andia.mixin.padang.Project;
import com.andia.mixin.padang.dumai.FormulaParser;
import com.andia.mixin.padang.garut.FilestoreGrpc.FilestoreImplBase;
import com.andia.mixin.padang.garut.adapters.ExpressionAdapterRegistry;
import com.andia.mixin.padang.model.XMutation;
import com.andia.mixin.padang.model.XOption;
import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryItem;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.SlemanFactory;
import com.andia.mixin.sleman.model.XAssignment;
import com.andia.mixin.sleman.model.XExpression;
import com.andia.mixin.sleman.model.XIdentifier;
import com.andia.mixin.sleman.model.XObject;
import com.andia.mixin.sleman.model.XText;

import io.grpc.stub.StreamObserver;

@Singleton
public class GarutFilestore extends FilestoreImplBase {

	private static final Logger logger = LoggerFactory.getLogger(GarutFilestore.class.getName());

	private UUID projectsId;
	private UUID untitlesId;
	private Repository repository;
	private Runserver runserver;
	private SecuritySetting setting;

	public void onStart(@Observes @Initialized(Singleton.class) Object pointless) {
		logger.info("Filestore on start");
	}

	@Inject
	public void setRepository(Repository repository) throws Exception {
		this.repository = repository;
		logger.info("GarutFilestore set repository");
	}

	@Inject
	public void setRunserver(Runserver runserver) throws Exception {
		this.runserver = runserver;
		logger.info("GarutFilestore set runserver");
	}

	@Inject
	public void setSetting(SecuritySetting setting) throws Exception {
		this.setting = setting;
		logger.info("GarutFilestore set setting");
	}

	@Override
	public void name(NameRequest request, StreamObserver<NameResponse> responseObserver) {

		// Request
		String key = request.getUuid();
		UUID uuid = UUID.fromString(key);
		RepositoryItem item = repository.loadItem(uuid);
		String name = item.getName();

		// Response
		NameResponse.Builder builder = NameResponse.newBuilder();
		builder.setName(name);
		NameResponse response = builder.build();
		complete(responseObserver, response);
	}

	@Override
	public void resolve(PathRequest request, StreamObserver<ResolveResponse> responseObserver) {

		// Item
		boolean resolved = false;
		boolean file = false;
		RepositoryItem item = getItem(request);
		if (item != null) {
			resolved = true;
			file = item.isFile();
		}

		// Response
		ResolveResponse.Builder builder = ResolveResponse.newBuilder();
		builder.setResolved(resolved);
		builder.setFile(file);
		ResolveResponse response = builder.build();
		complete(responseObserver, response);

	}

	@Override
	public void untitled(PathRequest request, StreamObserver<UntitledResponse> responseObserver) {

		boolean untitled = false;
		String path = request.getPath();
		String[] parts = path.split(Runspace.PATH_DELIMITER);
		if (parts.length == 1) {
			untitled = repository.isItemExists(untitlesId, path);
		}

		// Response
		UntitledResponse.Builder builder = UntitledResponse.newBuilder();
		builder.setExists(untitled);
		UntitledResponse response = builder.build();
		complete(responseObserver, response);
	}

	private <V> void complete(StreamObserver<V> responseObserver, V response) {
		responseObserver.onNext(response);
		responseObserver.onCompleted();
	}

	@Override
	public void identify(PathRequest request, StreamObserver<IdentifyResponse> responseObserver) {

		// Item
		String identity = "";
		RepositoryItem item = getItem(request);
		if (item != null) {
			UUID id = item.getId();
			identity = id.toString();
		}

		// Response
		IdentifyResponse.Builder builder = IdentifyResponse.newBuilder();
		builder.setUuid(identity);
		IdentifyResponse response = builder.build();
		complete(responseObserver, response);
	}

	private RepositoryItem getItem(PathRequest request) {

		if (projectsId == null) {
			String space = setting.getUserId();
			if (repository.isRootItemExists(space)) {
				UUID rootId = repository.getRootItemId(space);
				projectsId = repository.getItemId(rootId, Project.PROJECTS);
				untitlesId = repository.getItemId(rootId, BaseRunserver.UNTITLES);
			} else {
				logger.error("Missing repository for '" + space + "'");
			}
		}

		String path = request.getPath();
		String current = request.getCurrent();
		if (!path.startsWith(Runspace.PATH_DELIMITER)) {

			// Sibling file
			String filename = path;
			RepositoryItem reference = repository.loadItem(UUID.fromString(current));
			UUID folderId = reference.getParentId();
			if (repository.isItemExists(folderId, filename)) {
				RepositoryItem item = repository.loadItem(folderId, filename);
				return item;
			} else {
				return null;
			}

		} else {

			// Other file start with /
			path = path.substring(1);
			String[] parts = path.split(Runspace.PATH_DELIMITER);
			if (parts.length > 0) {
				UUID id = projectsId;
				for (int i = 0; i < parts.length; i++) {
					String name = parts[i];
					if (repository.isItemExists(id, name)) {
						RepositoryItem item = repository.loadItem(id, name);
						id = item.getId();
						if (i == parts.length - 1) {
							return item;
						}
					} else {
						break;
					}
				}
				return null;
			} else {
				return repository.loadItem(projectsId);
			}
		}
	}

	@Override
	public void credential(CredentialRequest request, StreamObserver<CredentialResponse> responseObserver) {

		SlemanFactory factory = SlemanFactory.eINSTANCE;
		CredentialResponse.Builder builder = CredentialResponse.newBuilder();
		ExpressionAdapterRegistry registry = ExpressionAdapterRegistry.getInstance();

		try {

			// Request
			String group = request.getGroup();
			String name = request.getName();
			String space = setting.getUserId();
			Runextra runextra = this.runserver.getRunextra(space);
			XMutation mutation = (XMutation) runextra.loadModel(group, name);

			// Object
			FormulaParser parser = new FormulaParser();
			XObject object = factory.createXObject();
			EList<XAssignment> fields = object.getFields();
			EList<XOption> options = mutation.getOptions();
			for (XOption option : options) {

				// Key
				String key = option.getName();
				XAssignment assignment = factory.createXAssignment();
				XIdentifier identifier = factory.createXIdentifier();
				identifier.setName(key);
				assignment.setName(identifier);

				// Value
				String formula = option.getFormula();
				SExpression expression = parser.parse(formula);
				assignment.setExpression((XExpression) expression);
				fields.add(assignment);
			}

			EvaluateExpression value = registry.toExpression(object);
			builder.setCredential(value);

		} catch (Exception e) {

			String message = e.getMessage();
			XText text = factory.createXText();
			text.setValue(message);
			EvaluateExpression value = registry.toExpression(text);
			builder.setCredential(value);

		}

		// Response
		CredentialResponse response = builder.build();
		complete(responseObserver, response);
	}

}
