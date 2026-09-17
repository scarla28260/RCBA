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
      <div class="absolute bottom-3 right-4 z-10 pointer-events-none flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-mono text-emerald-400">
        <span class="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse"></span>
        <span>WebGL 3D Interactive &bull; Parallax Active</span>
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

  // Objets 3D
  private ballGroup = new THREE.Group();
  private mouseX = 0;
  private mouseY = 0;
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
    this.targetRotationX = -y * 0.5;
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
    this.camera.position.z = 5.5;

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const pointLightBlue = new THREE.PointLight(0x2563eb, 3, 20);
    pointLightBlue.position.set(-4, 3, 4);
    this.scene.add(pointLightBlue);

    const pointLightNeon = new THREE.PointLight(0x00ff66, 4, 20);
    pointLightNeon.position.set(4, -2, 3);
    this.scene.add(pointLightNeon);

    // 5. Géométrie Football / Icosahedron Stylisé (Wireframe & Coeur Dark)
    // Coeur solide bleu nuit
    const coreGeometry = new THREE.IcosahedronGeometry(1.5, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x070B14,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x051336,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    this.ballGroup.add(coreMesh);

    // Wireframe vert néon (#00FF66) pour le style géométrique cyberpunk
    const wireGeometry = new THREE.IcosahedronGeometry(1.55, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff66,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    this.ballGroup.add(wireMesh);

    // Anneau d'énergie orbitale extérieur
    const ringGeo = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    this.ballGroup.add(ringMesh);

    // Anneau d'énergie vert néon secondaire
    const ringGeo2 = new THREE.TorusGeometry(2.3, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00ff66,
      transparent: true,
      opacity: 0.6,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    ringMesh2.rotation.x = Math.PI / 6;
    this.ballGroup.add(ringMesh2);

    this.scene.add(this.ballGroup);
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    // 1. Rotation continue autonome (vitesse fluide)
    this.ballGroup.rotation.y += 0.008;
    this.ballGroup.rotation.x += 0.004;

    // 2. Parallax tracking fluide avec amorti (lerp)
    this.ballGroup.rotation.y += (this.targetRotationY - this.ballGroup.rotation.y) * 0.05;
    this.ballGroup.rotation.x += (this.targetRotationX - this.ballGroup.rotation.x) * 0.05;

    // 3. Flottement vertical sinusoïdal
    const time = performance.now() * 0.0015;
    this.ballGroup.position.y = Math.sin(time) * 0.12;

    this.renderer.render(this.scene, this.camera);
  };
}
