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

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

/**
 * View di design pattern MVC:<br>
 * 1. Representasi visual dari sebuah model tetapi tidak mengandung model.
 * 1. Mengikuti mekanisme java beans.
 * 1. Harus mengimplementasi createControl().
 * 1. Jika dapat mengandung view maka harus implements addView().
 * 1. getControl() di-implements jika ingin di kendalikan oleh parent-nya.
 * 1. Memegang daftar Target sebagai pihak yang meresponse user action.
 * 
 * Untuk tambahan lihat:
 * https://developer.apple.com/library/mac/documentation/General/Conceptual/CocoaEncyclopedia/Model-View-Controller/Model-View-Controller.html
 */
export abstract class View {

    /**
     * Buat view baru di parent composite tersebut:<br>
     * 1. Simpan control yang dibuat jika diperlukan oleh getControl()
     * 1. Bangun susunan view sesuai dengan model yang ditampilkan.
     */
    public abstract createControl(parent: Composite, index: number): void;

    /**
     * Ambil control yang telah dibuat di createControl();
     */
    public abstract getControl(): Control;

    /**
     * Tambahkan child view ke view ini dan perhatikan beberapa hal berikut:<br>
     * 1. Panggil child.createControl() dengan parent yang disiapkan di view ini
     * 1. Jangan lupa lakukan relayout() agar view yang ditambahkan terlihat.
     */
    public addView(child: View, index: number): void {

    }

    /**
     * Hapus view.
     * 1. Lakukan dispose control yang di hapus
     * 1. Pastikan layout terupdate
     */
    public removeView(child: View): void {

    }

    /**
    * Pindah view.
    * 1. Pindah control
    * 1. Pastikan layout terupdate
    */
    public moveView(child: View, index: number): void {

    }

}

export default View;