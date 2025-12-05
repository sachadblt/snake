import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #050505;
  background-image: 
    linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  color: #e0e0e0;
  font-family: 'Orbitron', sans-serif;
  text-align: center;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5rem;
  text-shadow: 
    0 0 10px #00f3ff,
    0 0 20px #00f3ff;
  color: #00f3ff;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 3rem;
  font-weight: 400;
  letter-spacing: 2px;
  color: #bc13fe;
  text-shadow: 0 0 5px rgba(188, 19, 254, 0.5);
`;

const CodeDisplay = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  font-size: 2rem;
  font-weight: bold;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    font-size: 1.5rem;
  }
`;

const Key = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(0, 243, 255, 0.3);
  border-radius: 8px;
  background: rgba(0, 243, 255, 0.05);
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.1);
  transition: all 0.2s;
  color: ${props => props.$active ? '#00f3ff' : 'rgba(255, 255, 255, 0.5)'};
  border-color: ${props => props.$active ? '#00f3ff' : 'rgba(0, 243, 255, 0.3)'};
  transform: ${props => props.$active ? 'scale(1.1)' : 'scale(1)'};
  box-shadow: ${props => props.$active ? '0 0 20px rgba(0, 243, 255, 0.6)' : '0 0 10px rgba(0, 243, 255, 0.1)'};
  font-family: 'Outfit', sans-serif; /* Keep arrows readable */
`;

const Hint = styled.div`
  margin-top: 2rem;
  font-size: 1.2rem;
  animation: ${blink} 2s infinite;
  color: #bc13fe;
  letter-spacing: 2px;
  text-shadow: 0 0 5px rgba(188, 19, 254, 0.5);
`;

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

const MobileButton = styled.button`
  background: transparent;
  border: 2px solid #00f3ff;
  color: #00f3ff;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
  transition: all 0.3s ease;
  margin-top: 2rem;
  animation: ${blink} 2s infinite;

  &:hover {
    background: rgba(0, 243, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 243, 255, 0.6);
    transform: scale(1.05);
  }
`;

const MobileMessage = styled.p`
  color: #bc13fe;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 5px rgba(188, 19, 254, 0.5);
`;

const KonamiLanding = ({ onUnlock }) => {
  const [inputSequence, setInputSequence] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Don't listen for keys on mobile (or do, but it's less relevant)

    const handleKeyDown = (e) => {
      const { key } = e;

      setInputSequence((prev) => {
        const newSequence = [...prev, key];

        // Check if the new sequence matches the beginning of the Konami code
        const isMatchSoFar = newSequence.every((k, i) => k === KONAMI_CODE[i]);

        if (!isMatchSoFar) {
          // If wrong key, reset, but check if the key itself starts the sequence (ArrowUp)
          return key === KONAMI_CODE[0] ? [key] : [];
        }

        if (newSequence.length === KONAMI_CODE.length) {
          onUnlock();
          return [];
        }

        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUnlock, isMobile]);

  const renderKey = (key, index) => {
    let label = key;
    if (key === 'ArrowUp') label = '↑';
    if (key === 'ArrowDown') label = '↓';
    if (key === 'ArrowLeft') label = '←';
    if (key === 'ArrowRight') label = '→';
    if (key === 'b') label = 'B';
    if (key === 'a') label = 'A';

    const isActive = index < inputSequence.length;

    return (
      <Key key={index} $active={isActive}>
        {label}
      </Key>
    );
  };

  return (
    <Container>
      <Title>Capy Snake</Title>
      <Subtitle>ACCES SECURISE REQUIS</Subtitle>

      {isMobile ? (
        <>
          <MobileMessage>Détection d'un terminal mobile...</MobileMessage>
          <MobileButton onClick={onUnlock}>
            Lancer le protocole
          </MobileButton>
        </>
      ) : (
        <>
          <CodeDisplay>
            {KONAMI_CODE.map((key, index) => renderKey(key, index))}
          </CodeDisplay>
          <Hint>↑ ↑ ↓ ↓ ← → ← → B A</Hint>
        </>
      )}
    </Container>
  );
};

export default KonamiLanding;
