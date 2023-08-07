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
package com.andia.mixin.bekasi.base;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.bekasi.Adjustment;
import com.andia.mixin.bekasi.AdjustmentCopy;
import com.andia.mixin.bekasi.AdjustmentSet;
import com.andia.mixin.bekasi.Consolidator;
import com.andia.mixin.bekasi.Enginery;
import com.andia.mixin.bekasi.Lifestage;
import com.andia.mixin.bekasi.Lifestage.Stage;
import com.andia.mixin.bekasi.LifestageRunmodel;
import com.andia.mixin.bekasi.Reconciler;
import com.andia.mixin.bekasi.RunstackException;
import com.andia.mixin.bekasi.Runstate;
import com.andia.mixin.bekasi.RunstateCreator;
import com.andia.mixin.bekasi.RunstateException;
import com.andia.mixin.bekasi.reconciles.FolderRunspaceReconcile;
import com.andia.mixin.model.EObject;
import com.andia.mixin.model.EObjectSerde;
import com.andia.mixin.model.EUtils;
import com.andia.mixin.raung.Repository;
import com.andia.mixin.raung.RepositoryException;
import com.andia.mixin.raung.RepositoryItem;
import com.andia.mixin.rmo.FeatureCall;
import com.andia.mixin.rmo.Modification;
import com.andia.mixin.rmo.Regulator;
import com.andia.mixin.rmo.RootRegulator;
import com.andia.mixin.rmo.RunmodelException;
import com.andia.mixin.util.TimedLogger;

public abstract class BaseRunstate implements Runstate {

	private static Logger logger = LoggerFactory.getLogger(BaseRunstate.class);

	private final Repository repository;
	private final String space;
	private final Reconciler reconciler;
	private final RunstateCreator creator;
	private final Enginery enginery;
	private final Consolidator consolidation;
	private final UUID untitlesId;
	private final UUID fileId;
	private final BaseLifestage filestage;

	protected LifestageRunmodel runmodel;

	public BaseRunstate(Repository repository, String space, Reconciler reconciler,
			RunstateCreator creator, Enginery enginery, Consolidator consolidation, UUID fileId, UUID untitlesId) {
		this.repository = repository;
		this.reconciler = reconciler;
		this.space = space;
		this.creator = creator;
		this.enginery = enginery;
		this.consolidation = consolidation;
		this.fileId = fileId;
		this.untitlesId = untitlesId;
		this.filestage = new BaseLifestage(repository, space, fileId);
		prepareRunmodel();
	}

	private void prepareRunmodel() {
		runmodel = createRunmodel(filestage, enginery);
		runmodel.registerCapability(Lifestage.class, filestage);
		runmodel.registerCapability(Consolidator.class, consolidation);
		runmodel.registerCapability(Runstate.class, this);
	}

	protected abstract LifestageRunmodel createRunmodel(Lifestage filestage, Enginery enginery);

	public void registerRunmodelCapability(Class<?> capabilityClass, Object capability) {
		runmodel.registerCapability(capabilityClass, capability);
	}

	@Override
	public Lifestage getFilestage() {
		return filestage;
	}

	@Override
	public void setModel(EObject model) {

		try {

			// Setting model editing ke yang terbaru
			String editing = serialize(model);
			repository.keepEditing(fileId, editing);
			setRunmodelContent(model);

		} catch (Exception e) {
			throw new RunstackException("Fail set runmodel content", e);
		}
	}

	@Override
	public void build() throws RunstateException {

		try {

			TimedLogger logger = new TimedLogger(BaseRunstate.logger);

			if (isUntitled(fileId)) {

				String editing = repository.readEditing(fileId);
				if (editing != null) {
					EObject model = deserialize(editing);
					setRunmodelContent(model);
				}

			} else {

				String editing = repository.readEditing(fileId);
				if (editing != null) {

					EObject model = deserialize(editing);
					setRunmodelContent(model);

				} else {

					String content = repository.loadContent(fileId);
					if (content != null) {
						EObject model = deserialize(content);
						setRunmodelContent(model);
					}

				}
			}

			logger.debugElapsedIn("Runstate building " + fileId);

		} catch (Exception e) {
			filestage.setStage(Stage.FAILURE);
			String message = "Runstate building " + fileId + " failed";
			logger.error(message, e);
			throw new RunstateException(message, e);
		}
	}

	/**
	 * Setting model ke runmodel akan menyebabkan stage berubah kembali ke loading
	 * dan setelah selesai akan dikembalikan ke running
	 * 
	 * @param model
	 * @throws RunmodelException
	 */
	private void setRunmodelContent(EObject model) throws RunmodelException {
		filestage.setStage(Stage.LOADING);
		runmodel.setContents(model);
		filestage.setStage(Stage.SERVING);
	}

	@Override
	public Regulator getRegulator() {
		RootRegulator rootRegulator = runmodel.getRootRegulator();
		return rootRegulator.getContents();
	}

	@Override
	public void cutoff() {
		Adjustment adjustment = runmodel.createAdjustment();
		adjustment.cutoff();
	}

	private EObject deserialize(String content) throws RunstackException {
		try {
			EObjectSerde<EObject> serde = createSerde();
			return serde.deserialize(content);
		} catch (Exception e) {
			throw new RunstackException("Fail save model", e);
		}
	}

	private String serialize(EObject model) throws RunstackException {
		try {
			EObjectSerde<EObject> serde = createSerde();
			return serde.serialize(model);
		} catch (Exception e) {
			throw new RunstackException("Fail save model", e);
		}
	}

	protected abstract EObjectSerde<EObject> createSerde();

	private boolean isUntitled(UUID fileId) {
		RepositoryItem item = repository.loadItem(fileId);
		UUID parentId = item.getParentId();
		return parentId.equals(untitlesId);
	}

	private EObject loadStoredModel(UUID fileId) throws RepositoryException {
		String content = repository.loadContent(fileId);
		EObject model = deserialize(content);
		return model;
	}

	@Override
	public void save() throws RunstateException {
		try {

			TimedLogger logger = new TimedLogger(BaseRunstate.logger);

			// Ambil model di repository untuk dibandingkan saat commit
			EObject storedModel = loadStoredModel(fileId);

			// Simpan edited model di runmodel
			EObject editedModel = runmodel.getModel();
			String editedContent = serialize(editedModel);
			repository.keepEditing(fileId, editedContent);
			repository.flushEditing(fileId);

			// Commit adjustment
			Adjustment adjustment = runmodel.createAdjustment();
			adjustment.save(storedModel);

			logger.debugElapsedIn("Runstate save " + fileId);

		} catch (Exception e) {
			throw new RunstackException("Fail save model", e);
		}

	}

	@Override
	public void revert() throws RunstateException {

		try {

			TimedLogger logger = new TimedLogger(BaseRunstate.logger);

			// Ambil model lama untuk dibandingkan saat revert
			EObject storedModel = loadStoredModel(fileId);

			// Lakukan rejoin variable yang deleted dan hapus yang created
			Adjustment modifiedAdjustment = runmodel.createAdjustment();
			AdjustmentSet original = modifiedAdjustment.revert(storedModel);

			// Hapus editing dan bangun kembali dari model original
			repository.discardEditing(fileId);
			build();

			// Lakukan recompute ulang variable sesuai formula saat open
			Adjustment originalAdjustment = runmodel.createAdjustment();
			originalAdjustment.recompute(original);

			logger.debugElapsedIn("Runstate revert " + fileId);

		} catch (Exception e) {
			throw new RunstackException("Fail revert model", e);
		}
	}

	@Override
	public Runstate saveAs(UUID folderId, String newName) throws RunstateException {

		TimedLogger logger = new TimedLogger(BaseRunstate.logger);

		// Copy current model untuk di modifikasi nantinya
		EObject editedModel = runmodel.getModel();
		EObject editedModelCopy = (EObject) EUtils.copy(editedModel);

		if (isUntitled(fileId)) {

			// Untitled model langsung commit
			Adjustment currentAdjustment = runmodel.createAdjustment();
			currentAdjustment.commitCutoff();

			// Move kemudian rename file menjadi yang baru dan hapus editing
			repository.moveItem(fileId, folderId);
			repository.renameItem(fileId, newName);
			repository.flushEditing(fileId);
			reconcile(folderId);

			logger.debugElapsedIn("Runstate save-as " + fileId);
			return this;

		} else {

			try {

				// Hapus editing dari file awal
				repository.discardEditing(fileId);
				EObject storedModel = loadStoredModel(fileId);

				// Existing model harus buat file baru
				UUID newFileId = createFile(folderId, newName);

				// Buat adjustment yang ada dari model sekarang
				Adjustment currentAdjustment = runmodel.createAdjustment();
				AdjustmentCopy copiedVariables = currentAdjustment.saveAs(newFileId);

				// Rejoin variable tanpa created variable dan rebuild dari stored model
				AdjustmentSet rejoined = currentAdjustment.revert(storedModel);
				build();

				// Recompute rejoined variable
				Adjustment originalAdjustment = runmodel.createAdjustment();
				originalAdjustment.recompute(rejoined);

				// Ganti semua variable id untuk model yang akan di commit
				copiedVariables.reassignFeatures(editedModelCopy);

				// Save edited file baru yang akan di commit
				String content = serialize(editedModelCopy);
				repository.saveContent(newFileId, content);
				repository.placeEditing(newFileId);

				// Create dan build runstate yang baru
				BaseRunstate newFileRunstate = (BaseRunstate) creator.createRunstate(newFileId);
				newFileRunstate.build();

				// Commit dengan acuan stored model yang ber-id baru
				LifestageRunmodel newFileRunmodel = newFileRunstate.runmodel;
				Adjustment newFileAdjustment = newFileRunmodel.createAdjustment();
				newFileAdjustment.commitCutoff();

				// Resettle variable karena reference ke notebook yang sama sudah tidak uptodate
				newFileAdjustment.resettle(copiedVariables);

				logger.debugElapsedIn("Runstate save-as " + newFileId);
				return newFileRunstate;

			} catch (Exception e) {
				throw new RunstackException("Fail save model to new file", e);
			}
		}

	}

	private UUID createFile(UUID folderId, String filename) throws RepositoryException {
		UUID fileId = repository.createFile(folderId, filename);
		reconcile(folderId);
		return fileId;
	}

	private void reconcile(UUID folderId) {
		FolderRunspaceReconcile reconcile = new FolderRunspaceReconcile(folderId);
		reconciler.reconcile(space, reconcile);
	}

	@Override
	public void delete() throws RunstateException {
		Adjustment adjustment = runmodel.createAdjustment();
		adjustment.delete();
	}

	@Override
	public void rename() throws RunstateException {
		Adjustment adjustment = runmodel.createAdjustment();
		adjustment.rename();
	}

	@Override
	public Runstate copyTo(UUID targetFileId) throws RunstateException {

		try {

			TimedLogger logger = new TimedLogger(BaseRunstate.logger);

			// Siapkan loaded model dan copy
			EObject storedModel = runmodel.getModel();
			EObject storedModelCopy = (EObject) EUtils.copy(storedModel);

			// Lakukan copy variable di adjustment
			Adjustment adjustment = runmodel.createAdjustment();
			AdjustmentCopy copiedVariables = adjustment.copyTo(storedModel, targetFileId);

			// Berikan id baru ke stored model copy
			copiedVariables.reassignFeatures(storedModelCopy);

			// Simpan model baru dengan id yang baru ke repository
			String content = serialize(storedModelCopy);
			repository.saveContent(targetFileId, content);

			// Build dan kembalikan runstate baru
			BaseRunstate newFileRunstate = (BaseRunstate) creator.createRunstate(targetFileId);
			newFileRunstate.build();

			// Lakukan recompute ulang variable karena reference dapat berubah
			LifestageRunmodel newRunmodel = newFileRunstate.runmodel;
			Adjustment newAdjustment = newRunmodel.createAdjustment();
			newAdjustment.resettle(copiedVariables);

			logger.debugElapsedIn("Runstate copy-to " + targetFileId);

			return newFileRunstate;

		} catch (Exception e) {
			throw new RunstackException("Fail copy model to new file", e);
		}
	}

	@Override
	public EObject getModel() {
		return (EObject) runmodel.getModel();
	}

	@Override
	public synchronized void modify(Modification modification) {

		// Modify model
		runmodel.modify(modification);

		try {

			// Save modified model sebagai editing
			EObject editedModel = runmodel.getModel();
			String editing = serialize(editedModel);
			repository.keepEditing(fileId, editing);

		} catch (Exception e) {
			throw new RunstackException("Fail keep editing model", e);
		}

	}

	@Override
	public Object checkupState(FeatureCall call) throws RunstateException {

		try {
			return runmodel.checkupState(call);
		} catch (RunmodelException e) {
			throw new RunstateException("Fail checkup state for " + call, e);
		}
	}

	@Override
	public Object performAction(FeatureCall call) throws RunstateException {
		try {
			return runmodel.performAction(call);
		} catch (RunmodelException e) {
			throw new RunstateException("Fail perform action for " + call, e);
		}
	}

	@Override
	public <T> T getFacility(Class<? extends T> facilityClass) {
		return runmodel.getCapability(facilityClass);
	}

}
