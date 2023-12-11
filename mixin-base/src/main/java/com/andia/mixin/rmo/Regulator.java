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
package com.andia.mixin.rmo;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;

import com.andia.mixin.Lean;

public abstract class Regulator implements Supervisor {

	protected final static int FLAG_ACTIVE = 1;

	private Object model;
	private int flags = 0;
	private Outset outset;
	private Regulator parent;
	private List<Regulator> children = new ArrayList<>();
	private Map<Class<?>, Object> preparedObjects = new HashMap<>();
	private Map<String, Acceptor> acceptors = new HashMap<>();

	public void setModel(Object model) {
		this.model = model;
	}

	public Object getModel() {
		return model;
	}

	private void setParent(Regulator parent) {
		this.parent = parent;
	}

	@Override
	public Regulator getParent() {
		return parent;
	}

	@Override
	public int indexOf(Outset outset) {
		List<Regulator> children = getChildren();
		for (int i = 0; i < children.size(); i++) {
			Regulator regulator = children.get(i);
			Outset child = regulator.getOutset();
			if (child == outset) {
				return i;
			}
		}
		return -1;
	}

	protected abstract Outset createOutset();

	protected void setOutset(Outset outset) {
		this.outset = outset;
	}

	public List<Regulator> getChildren() {
		return Collections.unmodifiableList(this.children);
	}

	protected boolean getFlag(int flag) {
		return (this.flags & flag) != 0;
	}

	protected void setFlag(int flag, boolean value) {
		if (value == true) {
			this.flags |= flag;
		} else {
			this.flags &= ~flag;
		}
	}

	protected void addChild(Regulator child, int index) {
		children.add(index, child);
		child.setParent(this);
		child.createAcceptors();
		addChildOutset(child, index);
		child.addNotify();
		if (isActive()) {
			child.activate();
		}
	}

	public boolean isActive() {
		return getFlag(FLAG_ACTIVE);
	}

	public Regulator getChildRegulator(int index) {
		return this.children.get(index);
	}

	protected void addChildOutset(Regulator child, int index) {
		Outset outset = child.createOutset();
		child.setOutset(outset);
	}

	public Outset getOutset() {
		if (this.outset == null) {
			Outset outset = this.createOutset();
			this.setOutset(outset);
		}
		return this.outset;
	}

	private void addNotify() {
		for (int i = 0; i < children.size(); i++) {
			Regulator child = children.get(i);
			child.addNotify();
		}
		update();
	}

	protected void removeChild(Regulator child) {
		int index = children.indexOf(child);
		if (index < 0) {
			return;
		}
		child.deactivate();
		child.removeNotify();
		removeChildOutset(child);
		child.setParent(null);
		children.remove(index);
	}

	private void removeNotify() {
		for (int i = 0; i < children.size(); i++) {
			Regulator child = children.get(i);
			child.removeNotify();
		}
	}

	protected void removeChildOutset(Regulator child) {
		child.removeOutset();
		child.setOutset(null);
	}

	protected void removeOutset() {

	}

	protected void reorderChild(Regulator regulator, int index) {
		int oldIndex = children.indexOf(regulator);
		children.remove(oldIndex);
		children.add(index, regulator);
		this.moveChildOutset(regulator, index);
	}

	protected void moveChildOutset(Regulator regulator, int index) {

	}

	public void update() {
		this.updateChildren();
	}

	private Object[] getExistsModelChildren() {
		List<Object> children = new ArrayList<>();
		for (Object child : getModelChildren()) {
			if (child != null) {
				children.add(child);
			}
		}
		return children.toArray(new Object[0]);
	}

	protected synchronized void updateChildren() {

		Object[] models = this.getExistsModelChildren();
		int size = children.size();

		int i = 0;
		loop: while (i < children.size()) {

			// Check is regulator own one of the model
			Regulator child = children.get(i);
			for (int j = 0; j < models.length; j++) {
				if (this.isEquals(child.getModel(), models[j])) {
					i++;
					continue loop;
				}
			}
			this.removeChild(child);

		}

		for (i = 0; i < models.length; i++) {

			Object model = models[i];

			// Do a quick check to see if regulator[i] == model[i]
			if (i < children.size() && this.isEquals(children.get(i).getModel(), model)) {
				continue;
			}

			// See if the regulator is already around but in the wrong location
			Regulator regulator = null;
			if (size > i) {
				for (int j = i; j < children.size(); j++) {
					Regulator child = children.get(j);
					Object childModel = child.getModel();
					if (this.isEquals(childModel, model)) {
						regulator = child;
						break;
					}
				}
			}

			if (regulator != null) {

				// Regulator exists and move to current i
				this.reorderChild(regulator, i);

			} else {

				// Regulator for this model doesn't exist yet, create & insert
				regulator = this.createChild(model);
				this.addChild(regulator, i);

			}

		}

	}

	private Regulator createChild(Object model) {
		Runmodel runmodel = this.getRunmodel();
		RegulatorFactory factory = runmodel.getRegulatorFactory();
		if (model == null) {
			Class<? extends Regulator> regulatorClass = this.getClass();
			String simpleName = regulatorClass.getSimpleName();
			throw new RegulatorException(simpleName + " cannot create child for null model");
		}
		return factory.create(model);
	}

	protected void activate() {
		this.setFlag(FLAG_ACTIVE, true);
		if (outset instanceof Lifetime) {
			Lifetime lifetime = (Lifetime) outset;
			lifetime.initiate();
		}
		for (int i = 0; i < children.size(); i++) {
			Regulator regulator = children.get(i);
			regulator.activate();
		}
		if (outset instanceof Lifetime) {
			Lifetime lifetime = (Lifetime) outset;
			lifetime.activate();
		}
	}

	protected void deactivate() {
		for (int i = children.size() - 1; i >= 0; i--) {
			Regulator regulator = children.get(i);
			regulator.deactivate();
		}
		if (outset instanceof Lifetime) {
			Lifetime lifetime = (Lifetime) outset;
			lifetime.terminate();
		}
		this.setFlag(FLAG_ACTIVE, false);
	}

	private boolean isEquals(Object a, Object b) {
		return a.equals(b);
	}

	public Runmodel getRunmodel() {
		RootRegulator root = this.getRoot();
		if (root == null) {
			return null;
		}
		return root.getRunmodel();
	}

	protected RootRegulator getRoot() {
		Regulator parent = this.getParent();
		if (parent != null) {
			return parent.getRoot();
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	protected <T extends OutsetFactory> T getOutsetFactory() {
		Runmodel runmodel = this.getRunmodel();
		return (T) runmodel.getOutsetFactory();
	}

	protected Object[] getModelChildren() {
		return new Object[0];
	}

	@Override
	public <P> P getPreparedObject(Class<? extends P> preparedClass) {

		// Default cari di regulator menggunakan class yang diberikan
		Object preparedObject = preparedObjects.get(preparedClass);

		// Cari menggunakan class sebagai interface
		if (preparedObject == null) {
			for (Class<?> pClass : preparedObjects.keySet()) {
				if (preparedClass.isAssignableFrom(pClass)) {
					preparedObject = preparedObjects.get(pClass);
					break;
				}
			}
		}

		if (preparedObject != null) {

			// Kembalikan prepared object dengan casting atau cari di parent
			return preparedClass.cast(preparedObject);

		} else {

			// Cari secara recursive ke atas untuk preparedClass yang sesuai
			if (parent != null) {
				return parent.getPreparedObject(preparedClass);
			} else {
				return null;
			}
		}
	}

	@Override
	public <C> void setPreparedObject(Class<? extends C> preparationClass, C c) {
		preparedObjects.put(preparationClass, c);
	}

	@Override
	public <D> void applyDescendants(Class<? extends D> descendantClass, Consumer<D> consumer) {
		doApplyDescendants(descendantClass, consumer, this);
	}

	private <D> void doApplyDescendants(Class<? extends D> descendantClass,
			Consumer<D> consumer, Regulator parent) {
		for (Regulator regulator : parent.getChildren()) {
			Object descendant = regulator;
			if (Outset.class.isAssignableFrom(descendantClass)) {
				descendant = regulator.getOutset();
			}
			if (descendantClass.isInstance(descendant)) {
				D d = descendantClass.cast(descendant);
				consumer.accept(d);
			} else {
				doApplyDescendants(descendantClass, consumer, regulator);
			}
		}
	}

	@Override
	public <D> D getFirstDescendant(Class<? extends D> descendantClass, Function<D, Boolean> evaluator) {
		return doGetFirstDescendant(descendantClass, evaluator, this);
	}

	private <D> D doGetFirstDescendant(Class<? extends D> descendantClass, Function<D, Boolean> evaluator,
			Regulator parent) {
		for (Regulator regulator : parent.getChildren()) {
			Object descendant = regulator;
			if (Outset.class.isAssignableFrom(descendantClass)) {
				descendant = regulator.getOutset();
			}
			if (descendantClass.isInstance(descendant)) {
				D d = descendantClass.cast(descendant);
				if (evaluator.apply(d)) {
					return d;
				}
			} else {
				D o = doGetFirstDescendant(descendantClass, evaluator, regulator);
				if (o != null) {
					return o;
				}
			}
		}
		return null;
	}

	@Override
	public <D> Collection<D> getDescendants(Class<? extends D> descendantClass, Function<D, Boolean> evaluator) {
		List<D> list = new ArrayList<>();
		doGetDescendants(descendantClass, evaluator, this, list);
		return list;
	}

	private <D> void doGetDescendants(Class<? extends D> descendantClass, Function<D, Boolean> evaluator,
			Regulator parent, List<D> list) {
		for (Regulator regulator : parent.getChildren()) {
			Object descendant = regulator;
			if (Outset.class.isAssignableFrom(descendantClass)) {
				descendant = regulator.getOutset();
			}
			if (descendantClass.isInstance(descendant)) {
				D d = descendantClass.cast(descendant);
				if (evaluator.apply(d)) {
					list.add(d);
				}
			} else {
				doGetDescendants(descendantClass, evaluator, regulator, list);
			}
		}
	}

	@Override
	public <D> void applyFirstDescendant(Class<? extends D> descendantClass, Function<D, Boolean> evaluator,
			Consumer<D> consumer) {
		D descendant = getFirstDescendant(descendantClass, evaluator);
		if (descendant != null) {
			consumer.accept(descendant);
		}
	}

	@Override
	public <S> S getCapability(Class<? extends S> capabilityClass) {
		Runmodel runmodel = this.getRunmodel();
		return runmodel.getCapability(capabilityClass);
	}

	@Override
	public void submitIndication(String key, Lean... values) {
		Runmodel runmodel = getRunmodel();
		String qualifiedPath = getQualifiedPath();
		FeaturePath path = FeaturePathUtils.fromQualified(qualifiedPath);
		Indication indication = new Indication(path, key, values);
		runmodel.postIndication(indication);
	}

	@Override
	public void submit(Rectification rectification) {
		String type = rectification.getType();
		if (acceptors.containsKey(type)) {
			Acceptor acceptor = acceptors.get(type);
			List<Modification> pool = new ArrayList<>();
			acceptor.accept(rectification, pool);
			Runmodel runmodel = getRunmodel();
			for (Modification modification : pool) {
				runmodel.postRectification(modification);
			}
		}
	}

	protected void createAcceptors() {

	}

	protected void installRectificationAcceptors(String type, Acceptor acceptor) {
		this.acceptors.put(type, acceptor);
	}

}
