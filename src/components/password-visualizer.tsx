"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface PasswordVisualizerProps {
  password: string
  score: number
}

export function PasswordVisualizer({ password, score }: PasswordVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    geometry: THREE.BufferGeometry
    material: THREE.Material
    mesh: THREE.Mesh
    animationFrameId: number | null
    particlesGeometry?: THREE.BufferGeometry
    particlesMaterial?: THREE.PointsMaterial
  } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clean up previous scene if it exists
    if (sceneRef.current) {
      const { renderer, animationFrameId, geometry, material, particlesGeometry, particlesMaterial } = sceneRef.current
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      material.dispose()
      geometry.dispose()
      particlesGeometry?.dispose()
      particlesMaterial?.dispose()
      renderer.dispose()
      // Safely remove renderer element if it exists and is a child
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      sceneRef.current = null
    }

    // Set up new scene
    const width = container.clientWidth
    const height = container.clientHeight

    // Create scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Create geometry based on password strength
    let geometry: THREE.BufferGeometry
    let material: THREE.Material

    if (score < 20) {
      geometry = new THREE.BoxGeometry(2, 2, 2)
      material = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.7,
        metalness: 0.3,
      })
    } else if (score < 40) {
      geometry = new THREE.SphereGeometry(1.5, 16, 16)
      material = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.6,
        metalness: 0.4,
      })
    } else if (score < 60) {
      geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 32)
      material = new THREE.MeshStandardMaterial({
        color: 0xeab308,
        roughness: 0.5,
        metalness: 0.5,
      })
    } else if (score < 80) {
      geometry = new THREE.OctahedronGeometry(1.5, 1)
      material = new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        roughness: 0.4,
        metalness: 0.6,
      })
    } else {
      geometry = new THREE.DodecahedronGeometry(1.5, 0)
      material = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.3,
        metalness: 0.7,
      })
    }

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Add particles based on password complexity
    const particlesCount = Math.min(1000, password.length * 100)
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesPositions = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3
      particlesPositions[i3] = (Math.random() - 0.5) * 10
      particlesPositions[i3 + 1] = (Math.random() - 0.5) * 10
      particlesPositions[i3 + 2] = (Math.random() - 0.5) * 10
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlesPositions, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: getColorFromScore(score),
      transparent: true,
      opacity: 0.8,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Animation
    let animationFrameId: number | null = null
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      mesh.rotation.x += 0.01 * (score / 20)
      mesh.rotation.y += 0.01 * (score / 20)
      particles.rotation.x += 0.001
      particles.rotation.y += 0.001
      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Store references for cleanup
    sceneRef.current = {
      scene,
      camera,
      renderer,
      geometry,
      material,
      mesh,
      animationFrameId,
      particlesGeometry,
      particlesMaterial,
    }

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      material.dispose()
      geometry.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      renderer.dispose()
    }
  }, [password, score])

  function getColorFromScore(score: number): THREE.Color {
    if (score < 20) return new THREE.Color(0xef4444)
    if (score < 40) return new THREE.Color(0xf97316)
    if (score < 60) return new THREE.Color(0xeab308)
    if (score < 80) return new THREE.Color(0x22c55e)
    return new THREE.Color(0x10b981)
  }

  return <div ref={containerRef} className="w-full h-full" />
}