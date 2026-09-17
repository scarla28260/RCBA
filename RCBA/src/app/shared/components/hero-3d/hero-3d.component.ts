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

  // Groupe 3D principal
  private badgeGroup = new THREE.Group();

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
    // Événement réservé
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

    // 1. Scène épurée
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

    // 4. Système d'Éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLightFront = new THREE.DirectionalLight(0xe0f2fe, 2.0);
    dirLightFront.position.set(2, 3, 5);
    this.scene.add(dirLightFront);

    // 5. Chargement strict de la Texture avec SRGBColorSpace
    const textureLoader = new THREE.TextureLoader();
    const textureLogo = textureLoader.load('/logo.png');
    textureLogo.colorSpace = THREE.SRGBColorSpace;

    // =========================================================================
    // PHASE 16 : EXTRUSION 3D VIA "SPRITE STACKING" (100% BASÉ SUR L'ALPHA DU PNG)
    // =========================================================================

    this.badgeGroup = new THREE.Group();

    // Paramètres du volume
    const layers = 15; // Nombre de couches (finesse de la tranche)
    const thickness = 0.2; // Épaisseur totale du logo 3D
    const planeGeo = new THREE.PlaneGeometry(3, 3);

    for (let i = 0; i < layers; i++) {
      // Assombrit les couches internes pour simuler l'ombre de la tranche (effet 3D)
      // La face avant et arrière gardent leurs couleurs d'origine
      const isEdge = (i !== 0 && i !== layers - 1);
      const colorTint = isEdge ? 0x444444 : 0xffffff;

      const material = new THREE.MeshBasicMaterial({
        map: textureLogo,
        transparent: true,
        alphaTest: 0.5, // CRITIQUE : Découpe le maillage selon la transparence du PNG
        color: colorTint,
        side: THREE.DoubleSide,
      });

      const plane = new THREE.Mesh(planeGeo, material);

      // Décalage millimétrique sur l'axe Z pour créer l'épaisseur
      plane.position.z = (i - layers / 2) * (thickness / layers);

      this.badgeGroup.add(plane);
    }

    this.scene.add(this.badgeGroup);

    // Orientation initiale à zéro
    this.badgeGroup.position.set(0, 0, 0);
    this.badgeGroup.rotation.set(0, 0, 0);
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    // Consigne d'Animation : Oscillation UNIQUEMENT sur l'axe Y du groupe principal
    this.badgeGroup.rotation.y = Math.sin(this.clock.getElapsedTime() * 1.5) * 0.4;

    // Aucun autre axe de rotation
    this.badgeGroup.rotation.x = 0;
    this.badgeGroup.rotation.z = 0;

    this.renderer.render(this.scene, this.camera);
  };
}
