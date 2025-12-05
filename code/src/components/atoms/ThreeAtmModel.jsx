import { useLoader } from "@react-three/fiber"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { useFrame } from "@react-three/fiber"
import { useRef } from 'react'

const ThreeAtmModel = ({
    position = [0, -2, 0],
    rotationSpeedX = 0.0006,  // Very small x-rotation for slight wobble
    rotationSpeedY = 0.003,   // Main rotation - Earth rotates around its axis
    rotationSpeedZ = 0,       // No z-rotation needed
    scale = 0.02,
    modelPath = "Earth.fbx",
}) => {
    const model = useLoader(FBXLoader, `/assets/models/${modelPath}`)
    const modelRef = useRef()

    useFrame(() => {
        if (modelRef.current) {
            modelRef.current.rotation.x += rotationSpeedX
            modelRef.current.rotation.y += rotationSpeedY
            modelRef.current.rotation.z += rotationSpeedZ
        }
    })

    return <primitive ref={modelRef} object={model} scale={scale} position={position}/>
}

export default ThreeAtmModel