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

    // 5. Chargement de la Texture SANS AUCUNE MODIFICATION UV
    const textureLoader = new THREE.TextureLoader();
    const textureLogo = textureLoader.load('/logo.png');
    textureLogo.colorSpace = THREE.SRGBColorSpace;

    // =========================================================================
    // ARCHITECTURE DIRECTIVE STRICTE : LE "SANDWICH" 3 COUCHES
    // =========================================================================
    
    // 1. Le Groupe Principal (Le seul élément qui sera animé)
    this.badgeGroup = new THREE.Group();
    this.scene.add(this.badgeGroup);

    // 2. Couche Centrale : L'Image Plate (Zéro distorsion)
    // Cercle parfait face caméra. Le SEUL objet qui reçoit la texture.
    const logoGeo = new THREE.CircleGeometry(2, 64);
    const logoMat = new THREE.MeshBasicMaterial({ map: textureLogo, transparent: true });
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    logoMesh.position.set(0, 0, 0); // Centre absolu
    this.badgeGroup.add(logoMesh);

    // 3. Couche Arrière : L'Épaisseur du Badge (Le volume 3D)
    // Cylindre opaque (vert néon #00FF66) placé derrière l'image
    const backGeo = new THREE.CylinderGeometry(1.98, 1.98, 0.15, 64);
    const backMat = new THREE.MeshStandardMaterial({ color: 0x00FF66, metalness: 0.5, roughness: 0.5 });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.rotation.x = Math.PI / 2; // On couche le cylindre pour que sa face plate regarde la caméra
    backMesh.position.set(0, 0, -0.08); // Reculé DERRIÈRE l'image plate
    this.badgeGroup.add(backMesh);

    // 4. Couche Avant : Le Dôme de Résine (Le reflet)
    // Demi-sphère écrasée, 100% transparente, placée devant l'image
    const domeGeo = new THREE.SphereGeometry(2, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshPhysicalMaterial({
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      roughness: 0.0,
      clearcoat: 1.0,
    });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.rotation.x = Math.PI / 2; // Pointe vers la caméra
    domeMesh.scale.set(1, 0.2, 1); // Aplatissement extrême pour faire une lentille
    domeMesh.position.set(0, 0, 0.01); // Avancé juste DEVANT l'image plate
    this.badgeGroup.add(domeMesh);

    // Orientation initiale à zéro
    this.badgeGroup.position.set(0, 0, 0);
    this.badgeGroup.rotation.set(0, 0, 0);
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    // 5. L'Animation (Garde-fou strict)
    // Oscillation UNIQUEMENT sur l'axe Y du groupe principal
    this.badgeGroup.rotation.y = Math.sin(this.clock.getElapsedTime() * 1.5) * 0.35;

    // Aucun autre axe de rotation
    this.badgeGroup.rotation.x = 0;
    this.badgeGroup.rotation.z = 0;

    this.renderer.render(this.scene, this.camera);
  };
}
