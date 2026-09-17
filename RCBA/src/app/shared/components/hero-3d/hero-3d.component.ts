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

    // 2. Caméra parfaitement axée
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5.0);
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
    // A. Lumière d'ambiance très faible pour conserver la profondeur et les ombres
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(ambientLight);

    // B. Lumière directionnelle blanche légèrement bleutée pour éclairer la face du logo
    const dirLightFront = new THREE.DirectionalLight(0xe0f2fe, 2.4);
    dirLightFront.position.set(2, 3, 5);
    this.scene.add(dirLightFront);

    // C. PointLight vert néon (#00FF66) placé juste DERRIÈRE l'objet pour un halo subtil
    const pointLightBackGlow = new THREE.PointLight(0x00ff66, 5, 10);
    pointLightBackGlow.position.set(0, 0, -1.0);
    this.scene.add(pointLightBackGlow);

    // 5. Chargement de la Texture du Logo RCBA & Correction UV (Orientation & Symétrie)
    const textureLoader = new THREE.TextureLoader();
    
    // Texture Face Avant (normale, redressée via texture.center et texture.rotation)
    const logoTextureFront = textureLoader.load('/logo.png');
    logoTextureFront.colorSpace = THREE.SRGBColorSpace;
    logoTextureFront.generateMipmaps = true;
    logoTextureFront.minFilter = THREE.LinearMipmapLinearFilter;
    
    // Correction de l'orientation UV due à la rotation du cylindre :
    // On pivote la texture de 90° autour de son centre pour que le blason ait la pointe vers le bas
    logoTextureFront.center.set(0.5, 0.5);
    logoTextureFront.rotation = -Math.PI / 2;

    // Texture Face Arrière (inversion de l'axe X pour contrer l'effet miroir + rotation identique)
    const logoTextureBack = logoTextureFront.clone();
    logoTextureBack.wrapS = THREE.RepeatWrapping;
    logoTextureBack.repeat.x = -1;
    logoTextureBack.center.set(0.5, 0.5);
    logoTextureBack.rotation = -Math.PI / 2;

    // 6. Matériaux du Token (Material Array)
    // [0]: Tranche (Cylindre rim) - métallique sombre avec bordure émissive vert néon
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x070B14,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0x00ff66,
      emissiveIntensity: 0.7,
    });

    // [1]: Face avant - texture orientée correctement
    const frontMaterial = new THREE.MeshStandardMaterial({
      map: logoTextureFront,
      metalness: 0.15,
      roughness: 0.35,
      transparent: true,
    });

    // [2]: Face arrière - texture inversée sur X pour lisibilité
    const backMaterial = new THREE.MeshStandardMaterial({
      map: logoTextureBack,
      metalness: 0.15,
      roughness: 0.35,
      transparent: true,
    });

    const materials = [rimMaterial, frontMaterial, backMaterial];

    // 7. Géométrie : Cylindre aplati (Token / Écusson)
    // Rayon: 1.55, Épaisseur: 0.18, 64 segments
    const tokenGeometry = new THREE.CylinderGeometry(1.55, 1.55, 0.18, 64);
    
    // Basculer la géométrie du cylindre (axe Y -> Z) pour que les faces soient face caméra
    tokenGeometry.rotateX(Math.PI / 2);

    this.tokenMesh = new THREE.Mesh(tokenGeometry, materials);

    // Verrouillage strict des angles d'Euler initiaux
    this.tokenMesh.position.set(0, 0, 0);
    this.tokenMesh.rotation.set(0, 0, 0);

    // Ajout du seul mesh à la scène (suppression de tout anneau/torus/line)
    this.scene.add(this.tokenMesh);
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    const time = this.clock.getElapsedTime();

    // 1. Oscillation stricte sur l'axe Y : balancier de gauche à droite (amplitude 0.4 rad)
    // Code exact spécifié : mesh.rotation.y = Math.sin(time * 1.5) * 0.4;
    this.tokenMesh.rotation.y = Math.sin(time * 1.5) * 0.4;

    // 2. Verrouillage absolu : les axes X et Z restent strictement figés à 0
    this.tokenMesh.rotation.x = 0;
    this.tokenMesh.rotation.z = 0;

    // 3. Flottement vertical sinusoïdal très doux
    this.tokenMesh.position.y = Math.sin(time * 1.8) * 0.08;

    this.renderer.render(this.scene, this.camera);
  };
}
