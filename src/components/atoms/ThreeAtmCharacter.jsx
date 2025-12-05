import { useLoader } from "@react-three/fiber"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { TextureLoader } from "three"
import { useFrame } from "@react-three/fiber"
import { useRef } from 'react'

const ThreeAtmCharacter = ({
    position = [0, -2, 0],
    rotationSpeed = 0.005,
    scale = 0.02,
}) => {
    const character = useLoader(FBXLoader, "/assets/models/character/character.fbx")
    const texture = useLoader(TextureLoader, "/assets/models/character/character.png")
    const characterRef = useRef()

    useFrame(() => {
        if (characterRef.current) {
            characterRef.current.rotation.y += rotationSpeed
        }
    })

    character.traverse((child) => {
        if (child.isMesh) {
            child.material.map = texture
            child.material.needsUpdate = true
        }
    })

    return <primitive ref={characterRef} object={character} scale={scale} position={position}/>
}

export default ThreeAtmCharacter
