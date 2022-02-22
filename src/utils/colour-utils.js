import HSL_2_RGB from './hsl.json';

export default function hslToRGB(hsl) {
    return HSL_2_RGB[hsl];
}