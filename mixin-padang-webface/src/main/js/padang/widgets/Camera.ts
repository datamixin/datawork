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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

export default class Camera extends Control {

    private video: JQuery = null;
    private canvas: JQuery = null;

    constructor(parent: Composite, index?: number) {
        super(jQuery("<div>"), parent, index);
        this.element.addClass("padang-widgets-camera");
        this.createVideo();
        this.createCanvas();
        this.setupStream();
    }

    private createVideo(): void {
        this.video = jQuery("<video>");
        this.element.append(this.video);
    }

    private createCanvas(): void {
        this.canvas = jQuery("<canvas>");
        this.element.append(this.canvas);
    }

    private setupStream(): void {
        navigator.mediaDevices.enumerateDevices()
            .then((devices: MediaDeviceInfo[]) => {
                return this.initCamera();
            })
            .catch((reason: any) => {
                throw new Error(reason);
            });
    }

    private initCamera(): Promise<void> {
        let constraints = <MediaStreamConstraints>{
            audio: false,
            video: true
        }
        return navigator.mediaDevices.getUserMedia(constraints)
            .then((stream: MediaStream) => {

                let video = <HTMLVideoElement>this.video[0];
                video.onloadedmetadata = () => {
                    video.play();
                };
                video.oncanplay = () => {

                    let canvas = <HTMLCanvasElement>this.canvas[0];
                    canvas.width = this.width;
                    canvas.height = this.height;

                    let video = <HTMLVideoElement>this.video[0];
                    video.setAttribute("width", <any>canvas.width);
                    video.setAttribute("height", <any>canvas.height);

                };
                video.srcObject = stream;
            });
    }

    public takeImage(callback: (blob: Blob, callback: () => void) => void): void {
        let canvas = <HTMLCanvasElement>this.canvas[0];
        let video = <HTMLVideoElement>this.video[0];
        let context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob: Blob) => {
            callback(blob, () => {
                canvas.remove();
            });
        });
    }

    public dispose(): void {
        let video = <HTMLVideoElement>this.video[0];
        let stream = <MediaStream>video.srcObject
        let tracks = stream.getTracks();
        for (let track of tracks) {
            track.stop();
        }
        super.dispose();
    }

}
