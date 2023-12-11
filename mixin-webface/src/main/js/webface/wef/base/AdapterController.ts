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
import Adapter from "webface/model/Adapter";
import AdapterList from "webface/model/AdapterList";
import Notification from "webface/model/Notification";

import Controller from "webface/wef/Controller";

export abstract class AdapterController extends Controller implements Adapter {

    public activate(): void {

        super.activate();

        let adapters = this.getAdapters();
        adapters.add(this);

        // Tambah custom adapters
        let customAdapters = this.getCustomAdapters();
        for (let i = 0; i < customAdapters.length; i++) {
            let adapter = customAdapters[i];
            adapters.add(adapter);
        }
    }

    public deactivate(): void {

        super.deactivate();

        let adapters = this.getAdapters();
        adapters.remove(this);

        // Hapus custom adapters
        let customAdapters = this.getCustomAdapters();
        for (let i = 0; i < customAdapters.length; i++) {
            let adapter = customAdapters[i];
            adapters.remove(adapter);
        }
    }

    protected abstract getAdapters(): AdapterList;

    protected getCustomAdapters(): Adapter[] {
        return [];
    }

    public notifyChanged(notification: Notification): void {

    }

}

export default AdapterController;