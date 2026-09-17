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

  // Objets 3D du Token / Écusson
  private tokenGroup = new THREE.Group();
  private targetRotationX = 0;
  private targetRotationY = 0;

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
    const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    this.targetRotationY = x * 0.8;
    this.targetRotationX = -y * 0.4;
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

    // 1. Scène avec fond transparent pour se fondre dans le Dark Mode abyssal
    this.scene = new THREE.Scene();

    // 2. Caméra
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 5.2;

    // 3. Renderer avec antialiasing et transparence
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Éclairages
    // A. Lumière d'ambiance très faible
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // B. Lumière directionnelle blanche légèrement bleutée pour éclairer la face du logo
    const dirLightFront = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    dirLightFront.position.set(2, 4, 6);
    this.scene.add(dirLightFront);

    // C. PointLight vert néon (#00FF66) positionné juste DERRIÈRE l'objet pour un halo lumineux
    const pointLightBackGlow = new THREE.PointLight(0x00ff66, 6, 12);
    pointLightBackGlow.position.set(0, 0, -1.2);
    this.scene.add(pointLightBackGlow);

    // D. PointLight d'appoint bleu nuit/cyan sur le côté
    const pointLightSide = new THREE.PointLight(0x38bdf8, 2.5, 10);
    pointLightSide.position.set(-4, -1, 3);
    this.scene.add(pointLightSide);

    // 5. Chargement de la Texture du Logo RCBA
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/logo.png');
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.generateMipmaps = true;
    logoTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // Texture pour le dos (avec flip horizontal pour préserver le sens de lecture à la rotation)
    const logoTextureBack = logoTexture.clone();
    logoTextureBack.wrapS = THREE.RepeatWrapping;
    logoTextureBack.repeat.x = -1;

    // 6. Matériaux du Token / Palet
    // Matériau tranche : métallique sombre avec bordure émissive vert néon (#00FF66)
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a1020,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x00ff66,
      emissiveIntensity: 0.85,
    });

    // Matériau face avant (dessus du cylindre)
    const frontMaterial = new THREE.MeshStandardMaterial({
      map: logoTexture,
      metalness: 0.2,
      roughness: 0.4,
      transparent: true,
    });

    // Matériau face arrière (dessous du cylindre)
    const backMaterial = new THREE.MeshStandardMaterial({
      map: logoTextureBack,
      metalness: 0.2,
      roughness: 0.4,
      transparent: true,
    });

    // Ordre des matériaux pour CylinderGeometry : [0: tranche (rim), 1: top (face avant), 2: bottom (face arrière)]
    const materials = [rimMaterial, frontMaterial, backMaterial];

    // 7. Géométrie : Palet cylindrique aplati (Token de collection 3D)
    // Rayon: 1.6, Épaisseur: 0.22, 64 segments
    const tokenGeometry = new THREE.CylinderGeometry(1.6, 1.6, 0.22, 64);
    
    // Le cylindre natif Three.js a son axe sur Y ; on l'incline pour que les faces soient face caméra (Z)
    tokenGeometry.rotateX(Math.PI / 2);

    const tokenMesh = new THREE.Mesh(tokenGeometry, materials);
    this.tokenGroup.add(tokenMesh);

    // 8. Anneaux d'énergie orbitaux Cyberpunk & Halo
    // Anneau externe vert néon
    const glowRingGeo = new THREE.TorusGeometry(1.75, 0.03, 16, 100);
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: 0x00ff66,
      transparent: true,
      opacity: 0.75,
    });
    const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
    this.tokenGroup.add(glowRing);

    // Anneau d'énergie orbitale cyan tournant autour du token
    const orbitRingGeo = new THREE.TorusGeometry(2.1, 0.015, 16, 100);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 3.5;
    this.tokenGroup.add(orbitRing);

    this.scene.add(this.tokenGroup);
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    // 1. Rotation lente et continue sur l'axe Y
    this.tokenGroup.rotation.y += 0.006;

    // 2. Parallax tracking fluide vers la position de la souris avec amorti (lerp)
    this.tokenGroup.rotation.x += (this.targetRotationX - this.tokenGroup.rotation.x) * 0.05;
    this.tokenGroup.position.x += (this.targetRotationY * 0.3 - this.tokenGroup.position.x) * 0.05;

    // 3. Flottement vertical sinusoïdal
    const time = performance.now() * 0.0015;
    this.tokenGroup.position.y = Math.sin(time) * 0.12;

    this.renderer.render(this.scene, this.camera);
  };
}
