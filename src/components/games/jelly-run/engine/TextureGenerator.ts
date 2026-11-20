import * as THREE from 'three';
import { JELLY_COLORS } from './constants';

export class JellyTextureGenerator {
  private static cache: Map<number, THREE.CanvasTexture> = new Map();

  public static getCubeTexture(value: number): THREE.CanvasTexture {
    if (this.cache.has(value)) {
      return this.cache.get(value)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      const dummy = new THREE.CanvasTexture(canvas);
      return dummy;
    }

    const colorConfig = JELLY_COLORS[value] || JELLY_COLORS[2];

    // Background gradient
    const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 140);
    grad.addColorStop(0, colorConfig.bg);
    grad.addColorStop(1, this.shadeColor(colorConfig.bg, -25));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Inner bevel / glow ring
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    this.roundRect(ctx, 16, 16, 224, 224, 40);
    ctx.stroke();

    // Subtle specular shine on top half
    const shineGrad = ctx.createLinearGradient(0, 20, 0, 110);
    shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = shineGrad;
    this.roundRect(ctx, 24, 24, 208, 90, 28);
    ctx.fill();

    // Bold number text in center with drop shadow
    const textStr = value.toString();
    const fontSize = textStr.length > 3 ? (textStr.length > 4 ? 64 : 76) : 96;

    ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillText(textStr, 128, 134);

    // Main text
    ctx.fillStyle = colorConfig.text;
    ctx.fillText(textStr, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    this.cache.set(value, texture);
    return texture;
  }

  private static roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  private static shadeColor(color: string, percent: number): string {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.min(255, Math.max(0, Math.round(R * (100 + percent) / 100)));
    G = Math.min(255, Math.max(0, Math.round(G * (100 + percent) / 100)));
    B = Math.min(255, Math.max(0, Math.round(B * (100 + percent) / 100)));

    const RR = R.toString(16).padStart(2, '0');
    const GG = G.toString(16).padStart(2, '0');
    const BB = B.toString(16).padStart(2, '0');

    return `#${RR}${GG}${BB}`;
  }

  public static clearCache() {
    this.cache.forEach((tex) => tex.dispose());
    this.cache.clear();
  }
}
