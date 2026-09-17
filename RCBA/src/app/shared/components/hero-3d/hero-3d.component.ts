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
    // ARCHITECTURE 3D EN RELIEF (Support Cylindre Biseauté + Dôme de Résine)
    // =========================================================================
    this.badgeGroup = new THREE.Group();

    // -------------------------------------------------------------------------
    // 1. LE SUPPORT 3D DU LOGO (Cylindre épais / Jeton de collection)
    // -------------------------------------------------------------------------
    // Dimensions : Rayon 2, Épaisseur 0.2, 64 segments
    const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 64);
    
    // Matériau tranche (contour) : Métallique sombre avec liseré lumineux vert néon #00FF66
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x070B14,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x00ff66,
      emissiveIntensity: 0.8,
    });

    // Matériau face supérieure (couvercle avant) : Logo RCBA
    const faceMaterial = new THREE.MeshStandardMaterial({
      map: logoTexture,
      transparent: true,
      roughness: 0.3,
      metalness: 0.1,
    });

    // Matériau face inférieure (fond arrière)
    const backMaterial = new THREE.MeshStandardMaterial({
      color: 0x070B14,
      metalness: 0.9,
      roughness: 0.3,
    });

    // CylinderGeometry materials: [0: contour, 1: top, 2: bottom]
    const meshBase = new THREE.Mesh(cylinderGeometry, [rimMaterial, faceMaterial, backMaterial]);
    
    // Oriente le cylindre face caméra
    meshBase.rotation.x = Math.PI / 2;
    meshBase.position.set(0, 0, 0);
    this.badgeGroup.add(meshBase);

    // -------------------------------------------------------------------------
    // 2. LE DÔME DE RÉSINE (Demi-sphère écrasée par-dessus le cylindre)
    // -------------------------------------------------------------------------
    // Demi-sphère : phiLength = 2PI, thetaLength = PI/2
    const domeGeometry = new THREE.SphereGeometry(2, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    
    // Matériau du dôme : MeshPhysicalMaterial transparent avec clearcoat
    const domeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      roughness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      depthWrite: false, // Empêche l'occlusion du logo sous-jacent
    });
    const meshDome = new THREE.Mesh(domeGeometry, domeMaterial);
    
    // Aplatissement sur Y pour former la lentille bombée
    meshDome.scale.set(1, 0.15, 1);
    
    // Comme la demi-sphère pointe vers le haut (+Y), on la pivote de PI/2 sur X
    // pour que le sommet du dôme bombé pointe directement vers l'avant (vers la caméra)
    meshDome.rotation.x = Math.PI / 2;
    
    // Positionnée juste au-dessus de la face supérieure du cylindre (z = 0.10)
    meshDome.position.set(0, 0, 0.10);
    this.badgeGroup.add(meshDome);

    // Verrouillage initial du groupe
    this.badgeGroup.position.set(0, 0, 0);
    this.badgeGroup.rotation.set(0, 0, 0);

    // Ajout du groupe à la scène
    this.scene.add(this.badgeGroup);
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    // 3. Animation de balancier sur l'axe Y (Phase 14)
    this.badgeGroup.rotation.y = Math.sin(this.clock.getElapsedTime() * 1.2) * 0.3;

    // Ne touche à aucun autre axe de rotation
    this.badgeGroup.rotation.x = 0;
    this.badgeGroup.rotation.z = 0;

    this.renderer.render(this.scene, this.camera);
  };
}
