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

  // Groupe 3D contenant les 2 couches (Écusson plat + Dôme de résine)
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

    // 4. Système d'Éclairage (DirectionalLight pour accrocher le clearcoat du dôme de résine)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const dirLightFront = new THREE.DirectionalLight(0xe0f2fe, 2.5);
    dirLightFront.position.set(2, 3, 5);
    this.scene.add(dirLightFront);

    // 5. Chargement et Configuration Paramétrique de la Texture
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/logo.png');
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.generateMipmaps = true;
    logoTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // Paramètres stricts conservés
    logoTexture.center.set(0.5, 0.5);
    logoTexture.rotation = Math.PI;
    logoTexture.wrapS = THREE.RepeatWrapping;
    logoTexture.repeat.x = -1;
    logoTexture.flipY = false;

    // =========================================================================
    // ARCHITECTURE PBR À DOUBLE COUCHE (Groupe parent unique)
    // =========================================================================
    this.badgeGroup = new THREE.Group();

    // -------------------------------------------------------------------------
    // COUCHE 1 : L'Écusson (Plat et sans distorsion géométrique)
    // -------------------------------------------------------------------------
    const logoGeometry = new THREE.CircleGeometry(2, 64);
    const logoMaterial = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const meshLogo = new THREE.Mesh(logoGeometry, logoMaterial);
    meshLogo.position.set(0, 0, 0);
    this.badgeGroup.add(meshLogo);

    // -------------------------------------------------------------------------
    // COUCHE 2 : Le Dôme de Résine Époxy (Le Volume Lenticulaire en Verre PBR)
    // -------------------------------------------------------------------------
    // Demi-sphère (phiLength = 2PI, thetaLength = PI/2) écrasée sur Z pour créer une lentille convexe
    const domeGeometry = new THREE.SphereGeometry(2, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMaterial = new THREE.MeshPhysicalMaterial({
      map: null,
      transmission: 1.0,
      opacity: 1,
      transparent: true,
      roughness: 0.0,
      ior: 1.5,
      thickness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const meshDome = new THREE.Mesh(domeGeometry, domeMaterial);
    meshDome.scale.set(1, 1, 0.2);
    // Positionné juste devant l'écusson pour éviter le Z-fighting
    meshDome.position.set(0, 0, 0.05);
    this.badgeGroup.add(meshDome);

    // Verrouillage initial du groupe
    this.badgeGroup.position.set(0, 0, 0);
    this.badgeGroup.rotation.set(0, 0, 0);

    // Ajout du groupe à la scène
    this.scene.add(this.badgeGroup);
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    // Animation de balancier sur le GROUPE UNIQUEMENT
    this.badgeGroup.rotation.y = Math.sin(this.clock.getElapsedTime()) * 0.3;

    // Tout autre axe reste strictement figé à zéro
    this.badgeGroup.rotation.x = 0;
    this.badgeGroup.rotation.z = 0;

    this.renderer.render(this.scene, this.camera);
  };
}
