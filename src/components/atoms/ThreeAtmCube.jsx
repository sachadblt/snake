import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

const ThreeAtmCube = ({
  position = [0, 0, 0],
  color = '#ff3e00',
  size = 1,
  rotationSpeed = 0.005,
  wireframe = false,
  onClick
}) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  // Animation de rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed
      meshRef.current.rotation.y += rotationSpeed
    }
  })

  return (
    <mesh
      position={position}
      ref={meshRef}
      scale={active ? size * 1.2 : size}
      onClick={(event) => {
        setActive(!active)
        if (onClick) onClick(event)
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={hovered ? '#2196f3' : color} 
        wireframe={wireframe}
      />
    </mesh>
  )
}

export default ThreeAtmCube