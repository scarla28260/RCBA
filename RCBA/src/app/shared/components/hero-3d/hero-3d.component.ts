import {
  Component,
  ElementRef,
  viewChild,
  AfterViewInit,
  OnDestroy,
  NgZone,
  inject,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-hero-3d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-3d-container relative w-full h-[320px] sm:h-[400px] flex items-center justify-center select-none overflow-hidden">
      <!-- Canvas Three.js injecté -->
      <canvas #threeCanvas class="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing"></canvas>

      <!-- Overlay d'information discret -->
      <div class="absolute bottom-3 right-4 z-10 pointer-events-none flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-mono text-[#00FF66]">
        <span class="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse"></span>
        <span>Écusson 3D RCBA &bull; WebGL Interactif</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `],
})
export class Hero3DComponent implements AfterViewInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('threeCanvas');

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private clock = new THREE.Clock();

  // Mesh unique du Token / Logo RCBA
  private tokenMesh!: THREE.Mesh;
  private mouseParallaxY = 0;

  @HostListener('window:resize')
  onResize(): void {
    if (!this.canvasRef() || !this.renderer || !this.camera) return;
    const canvas = this.canvasRef().nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.canvasRef().nativeElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    // Subtile influence parallaxe sur l'axe Y
    this.mouseParallaxY = x * 0.25;
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initThree();
      this.animate();
    });
  }

  ngOnDestroy(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThree(): void {
    const canvas = this.canvasRef().nativeElement;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 350;

    // 1. Scène épurée (uniquement mesh du logo, éclairage et caméra)
    this.scene = new THREE.Scene();

    // 2. Caméra parfaitement en face à z = 5
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer avec antialiasing et transparence Dark Abyssal
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Système d'Éclairage épuré
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const dirLightFront = new THREE.DirectionalLight(0xe0f2fe, 2.5);
    dirLightFront.position.set(2, 3, 5);
    this.scene.add(dirLightFront);

    // 5. Chargement et Configuration Paramétrique de la Texture (Phase 10)
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/logo.png');
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.generateMipmaps = true;
    logoTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // 1. Placer le point de pivot au centre exact de l'image
    logoTexture.center.set(0.5, 0.5);

    // 2. Remettre l'image à l'endroit (rotation de 180° en radians)
    logoTexture.rotation = Math.PI;

    // 3. Annuler l'effet miroir pour que "RCBA" soit lisible de gauche à droite
    logoTexture.wrapS = THREE.RepeatWrapping;
    logoTexture.repeat.x = -1;

    // 4. Sécurité contre l'inversion par défaut de WebGL
    logoTexture.flipY = false;

    // 6. Matériau Avancé PBR (Physically Based Rendering - Effet Résine Époxy / Vernis)
    const tokenMaterial = new THREE.MeshPhysicalMaterial({
      map: logoTexture,
      side: THREE.DoubleSide,
      transparent: true,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // 7. Géométrie Convexe (Forme Lenticulaire / Badge Bombé)
    // Sphère haute résolution écrasée sur son axe de profondeur Z
    const tokenGeometry = new THREE.SphereGeometry(2, 64, 64);

    this.tokenMesh = new THREE.Mesh(tokenGeometry, tokenMaterial);

    // Écrasement sur l'axe Z pour transformer la sphère en pastille/badge bombé
    this.tokenMesh.scale.set(1, 1, 0.15);

    // Fixe l'orientation initiale de l'objet 3D à zéro (parfaitement vertical, face caméra)
    this.tokenMesh.position.set(0, 0, 0);
    this.tokenMesh.rotation.set(0, 0, 0);

    // La scène 3D ne contient QUE le mesh du logo, l'éclairage et la caméra
    this.scene.add(this.tokenMesh);
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    // Phase 10 : Utilise UNIQUEMENT cette ligne pour l'animation
    // Mouvement de balancier lent de gauche à droite
    this.tokenMesh.rotation.y = Math.sin(this.clock.getElapsedTime()) * 0.3;

    // Tout autre axe reste strictement figé à zéro
    this.tokenMesh.rotation.x = 0;
    this.tokenMesh.rotation.z = 0;

    this.renderer.render(this.scene, this.camera);
  };
}
