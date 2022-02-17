export default class Sprite {

    constructor(definitions) {
        this.definitions = definitions;
    }

    verticalFlip() {
        let pixels = this.definitions.pixels;
        if (!this.definitions.alpha) {
            for (let i = (height >> 1) - 1; i >= 0; --i) {
                let i_3 = i * width;
                let i_4 = (height - i - 1) * width;
                for (let j = -width; j < 0; j++) {
                    let temp = pixels[i_3];
                    pixels[i_3] = pixels[i_4];
                    pixels[i_4] = temp;
                    i_3++;
                    i_4++;
                }
            }
        } else {
            let alpha = this.definitions.alpha;
            for (let i = (height >> 1) - 1; i >= 0; --i) {
                let i_4 = i * width;
                let i_5 = (height - i - 1) * width;
                for (let j = -width; j < 0; j++) {
                    let temp = pixels[i_4];
                    pixels[i_4] = pixels[i_5];
                    pixels[i_5] = temp;

                    temp = alpha[i_4];
                    alpha[i_4] = alpha[i_5];
                    alpha[i_5] = temp;
                    i_4++;
                    i_5++;
                }
            }
        }

        let temp = this.definitions.minY;
        this.definitions.minY = this.definitions.anInt953;
        this.definitions.anInt953 = temp;
    }

    horizontalFlip() {
        let pixels = this.definitions.pixels;
        if (!this.definitions.alpha) {
            for (let i = height - 1; i >= 0; --i) {
                let i_3 = i * width;

                for (let j = (i + 1) * width; i_3 < j; i_3++) {
                    j--;
                    let temp = pixels[i_3];
                    pixels[i_3] = pixels[j];
                    pixels[j] = temp;
                }
            }
        } else {
            let alpha = this.definitions.alpha;
            for (let i = height - 1; i >= 0; --i) {
                let i_4 = i * width;

                for (let j = (i + 1) * width; i_4 < j; i_4++) {
                    j--;
                    let temp = pixels[i_4];
                    pixels[i_4] = pixels[j];
                    pixels[j] = temp;

                    temp = alpha[i_4];
                    alpha[i_4] = alpha[j];
                    alpha[j] = temp;
                }
            }
        }

        let temp = this.definitions.minX;
        this.definitions.minX = this.definitions.anInt958;
        this.definitions.anInt958 = temp;
    }
}