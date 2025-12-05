import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import styled from 'styled-components';

const SceneContainer = styled.div`
  width: 100%;
  max-height: ${props => props.theme.maxHeight.scene};
  aspect-ratio: 1;
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  background-color: ${props => props.backgroundColor};
`;

const ThreeOrgScene = ({
  children,
  backgroundColor = "black",
}) => {
  return (
    <SceneContainer backgroundColor={backgroundColor}>
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        {children}
        <OrbitControls />
      </Canvas>
    </SceneContainer>
  )
}

export default ThreeOrgScene