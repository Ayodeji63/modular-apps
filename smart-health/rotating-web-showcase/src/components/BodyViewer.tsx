import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { ChevronLeft, ChevronRight, Info, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function AnatomicalBody() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <capsuleGeometry args={[0.4, 1.5, 32, 32]} />
        <meshStandardMaterial color="#d97656" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#d97656" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.6, 0.3, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.12, 1.2, 16, 16]} />
        <meshStandardMaterial color="#d97656" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0.6, 0.3, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.12, 1.2, 16, 16]} />
        <meshStandardMaterial color="#d97656" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, -1.4, 0]}>
        <capsuleGeometry args={[0.15, 1.3, 16, 16]} />
        <meshStandardMaterial color="#d97656" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0.2, -1.4, 0]}>
        <capsuleGeometry args={[0.15, 1.3, 16, 16]} />
        <meshStandardMaterial color="#d97656" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Muscle detail lines */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[0, 0.6 - i * 0.2, 0.41]}>
          <boxGeometry args={[0.6, 0.02, 0.02]} />
          <meshStandardMaterial color="#a85540" />
        </mesh>
      ))}

      {/* Medical markers */}
      <mesh position={[0, 0.8, 0.42]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color="#0066FF" emissive="#0066FF" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.42]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, -0.8, 0.42]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

const BodyViewer = () => {
  return (
    <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <AnatomicalBody />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
        />
        <Environment preset="studio" />
      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <Button variant="outline" size="icon" className="rounded-full bg-white/90 backdrop-blur">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full bg-white/90 backdrop-blur">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <Button variant="outline" size="icon" className="rounded-full bg-white/90 backdrop-blur">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full bg-white/90 backdrop-blur">
          <Info className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full bg-white/90 backdrop-blur">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BodyViewer;
