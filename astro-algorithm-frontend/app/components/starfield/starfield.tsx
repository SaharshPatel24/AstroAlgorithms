"use client"
import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import * as THREE from 'three';

const ThreeJSComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, stars: THREE.Mesh[] = [];

  useEffect(() => {
    init();
    addSphere();
    render();

    return () => {
      cleanUpScene();
    };
  }, []);

  const init = () => {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 5;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const addSphere = () => {
    for (let z = -1000; z < 1000; z += 20) {
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const sphere = new THREE.Mesh(geometry, material);

      sphere.position.x = Math.random() * 1000 - 500;
      sphere.position.y = Math.random() * 1000 - 500;
      sphere.position.z = z;

      sphere.scale.x = sphere.scale.y = 2;

      scene.add(sphere);
      stars.push(sphere);
    }
  };

  const animateStars = () => {
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      star.position.z += i / 10;

      if (star.position.z > 1000) star.position.z -= 2000;
    }
  };

  const render = () => {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    animateStars();
  };

  const cleanUpScene = () => {
    stars.forEach(star => {
      star.geometry.dispose();
      star.material.dispose();
      scene.remove(star);
    });

    stars = [];
  };

  return (
    <Box>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100vh', margin: 0 }} />
    </Box>
  );
};

export default ThreeJSComponent;
