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
package com.andia.mixin.padang;

import java.util.UUID;

import com.andia.mixin.bekasi.Runstack;
import com.andia.mixin.padang.model.XProject;

/**
 * Memegang semua notebook yang loaded atau berjalan. File dikenali dengan key
 * yang berupa nama file untitled (sementara) atau fileId (identitas fiel yang
 * tersimpan).
 * 
 * @author jon
 *
 */
public interface ProjectRunstack extends Runstack {

	@Override
	public XProject getModel(UUID fileId);

}
