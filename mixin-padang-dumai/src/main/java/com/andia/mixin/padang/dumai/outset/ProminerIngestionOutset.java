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
package com.andia.mixin.padang.dumai.outset;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.andia.mixin.padang.dumai.ProminerException;
import com.andia.mixin.padang.dumai.anchors.DatasetAnchor;
import com.andia.mixin.padang.dumai.anchors.IngestionAnchor;
import com.andia.mixin.padang.outset.IngestionOutset;
import com.andia.mixin.rmo.Lifetime;
import com.andia.mixin.rmo.Supervisor;

public class ProminerIngestionOutset extends ProminerSourceOutset implements IngestionOutset, Lifetime {

	private static Logger logger = LoggerFactory.getLogger(ProminerIngestionOutset.class);

	private Supervisor supervisor;
	private DatasetAnchor dataset;

	public ProminerIngestionOutset(Supervisor supervisor) {
		this.supervisor = supervisor;
		assignDatasetAnchor();
		prepareIngestionAnchor();
	}

	private void assignDatasetAnchor() {
		dataset = supervisor.getPreparedObject(DatasetAnchor.class);
	}

	private void prepareIngestionAnchor() {
		supervisor.setPreparedObject(IngestionAnchor.class, new ProminerIngestionAnchor());
	}

	@Override
	public void initiate() {
		try {
			dataset.prepareIngestion();
		} catch (ProminerException e) {
			logger.error("Fail initiate ingestion", e);
		}
	}

	@Override
	public void activate() {

	}

	@Override
	public void terminate() {

	}

	class ProminerIngestionAnchor implements IngestionAnchor {

	}

}
