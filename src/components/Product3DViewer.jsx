

// // import React, { Suspense, useState } from 'react';
// // import { Canvas } from '@react-three/fiber';
// // import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

// // function Model({ modelPath }) {
// //   const { scene } = useGLTF(modelPath);
// //   return <primitive object={scene} scale={1.0} position={[0, -0.5, 0]} />;
// // }

// // const Product3DViewer = ({ modelPath, onClose }) => {
// //   const [bodyType, setBodyType] = useState('slim');

// //   // If no model path, show "Coming Soon"
// //   if (!modelPath || modelPath === '') {
// //     return (
// //       <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
// //         <button onClick={onClose} className="absolute top-6 right-6 text-white text-4xl">✕</button>
// //         <div className="text-center text-white">
// //           <h2 className="text-3xl font-thin tracking-widest">3D VIEW</h2>
// //           <p className="text-gray-400 text-sm tracking-widest mt-4">Coming soon for this saree.</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Get model path based on body type (for now, all use the same model)
// //   const getModelPath = (type) => {
// //     return modelPath; // All body types use the same model for now
// //   };

// //   return (
// //     <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
// //       {/* Close Button */}
// //       <button
// //         onClick={onClose}
// //         className="absolute top-6 right-6 text-white text-4xl font-light hover:rotate-90 transition-transform duration-300 z-20"
// //       >
// //         ✕
// //       </button>

// //       {/* Body Type Selector */}
// //       <div className="absolute top-6 left-6 flex gap-3 z-20">
// //         {['slim', 'fat', 'athletic'].map((type) => (
// //           <button
// //             key={type}
// //             onClick={() => setBodyType(type)}
// //             className={`px-4 py-2 text-xs uppercase tracking-widest rounded-full border transition-all duration-300 ${
// //               bodyType === type
// //                 ? 'bg-white text-black border-white'
// //                 : 'bg-transparent text-white border-white/30 hover:border-white'
// //             }`}
// //           >
// //             {type}
// //           </button>
// //         ))}
// //       </div>

// //       {/* 3D Canvas - Adjusted camera position */}
// //       <div className="w-full max-w-4xl h-[80vh] rounded-xl overflow-hidden relative">
// //         <Suspense
// //           fallback={
// //             <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm tracking-widest">
// //               LOADING 3D MODEL...
// //             </div>
// //           }
// //         >
// //           <Canvas camera={{ position: [0, 0.5, 5], fov: 45 }}>
// //             <ambientLight intensity={0.6} />
// //             <spotLight position={[5, 5, 5]} intensity={1} />
// //             <pointLight position={[-5, -5, -5]} intensity={0.5} />
            
// //             <Model modelPath={getModelPath(bodyType)} />
            
// //             <OrbitControls 
// //               enableZoom={true} 
// //               enableRotate={true} 
// //               minDistance={2} 
// //               maxDistance={10}
// //               target={[0, 0.5, 0]} // Look at the center of the model
// //             />
// //             <Environment preset="studio" />
// //           </Canvas>
// //         </Suspense>
// //       </div>

// //       {/* Instructions */}
// //       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest font-light z-10">
// //         DRAG TO ROTATE · SCROLL TO ZOOM
// //       </div>
// //     </div>
// //   );
// // };

// // export default Product3DViewer;

// import React, { Suspense, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

// function Model({ modelPath }) {
//   const { scene } = useGLTF(modelPath);
//   return <primitive object={scene} scale={1.0} position={[0, -0.5, 0]} />;
// }

// const Product3DViewer = ({ modelPath, onClose }) => {
//   const [bodyType, setBodyType] = useState('slim');

//   // If no model path, show "Coming Soon"
//   if (!modelPath || modelPath === '') {
//     return (
//       <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
//         <button onClick={onClose} className="absolute top-6 right-6 text-white text-4xl">✕</button>
//         <div className="text-center text-white">
//           <h2 className="text-3xl font-thin tracking-widest">3D VIEW</h2>
//           <p className="text-gray-400 text-sm tracking-widest mt-4">Coming soon for this saree.</p>
//         </div>
//       </div>
//     );
//   }

//   // 🔥 FIXED: Returns a DIFFERENT path for each body type
//   const getModelPath = (type) => {
//     const basePath = '/models/mannequin-';
//     return `${basePath}${type}.glb`;
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
//       {/* Close Button */}
//       <button
//         onClick={onClose}
//         className="absolute top-6 right-6 text-white text-4xl font-light hover:rotate-90 transition-transform duration-300 z-20"
//       >
//         ✕
//       </button>

//       {/* Body Type Selector */}
//       <div className="absolute top-6 left-6 flex gap-3 z-20">
//         {['slim', 'fat', 'athletic'].map((type) => (
//           <button
//             key={type}
//             onClick={() => setBodyType(type)}
//             className={`px-4 py-2 text-xs uppercase tracking-widest rounded-full border transition-all duration-300 ${
//               bodyType === type
//                 ? 'bg-white text-black border-white'
//                 : 'bg-transparent text-white border-white/30 hover:border-white'
//             }`}
//           >
//             {type}
//           </button>
//         ))}
//       </div>

//       {/* 3D Canvas */}
//       <div className="w-full max-w-4xl h-[80vh] rounded-xl overflow-hidden relative">
//         <Suspense
//           fallback={
//             <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm tracking-widest">
//               LOADING 3D MODEL...
//             </div>
//           }
//         >
//           <Canvas camera={{ position: [0, 0.5, 5], fov: 45 }}>
//             <ambientLight intensity={0.6} />
//             <spotLight position={[5, 5, 5]} intensity={1} />
//             <pointLight position={[-5, -5, -5]} intensity={0.5} />
            
//             {/* 🔥 Now passes the dynamic path based on bodyType */}
//             <Model modelPath={getModelPath(bodyType)} />
            
//             <OrbitControls 
//               enableZoom={true} 
//               enableRotate={true} 
//               minDistance={2} 
//               maxDistance={10}
//               target={[0, 0.5, 0]}
//             />
//             <Environment preset="studio" />
//           </Canvas>
//         </Suspense>
//       </div>

//       {/* Instructions */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest font-light z-10">
//         DRAG TO ROTATE · SCROLL TO ZOOM
//       </div>
//     </div>
//   );
// };

// export default Product3DViewer;

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={1.0} position={[0, -0.5, 0]} />;
}

const Product3DViewer = ({ modelPath, onClose }) => {
  const [bodyType, setBodyType] = useState('slim');

  // If no model path, show "Coming Soon"
  if (!modelPath || modelPath === '') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
        <div className="glass-royal rounded-2xl max-w-md w-full p-8 border border-[#d4af37]/30 shadow-2xl shadow-[#d4af37]/10 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gold-royal transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h2 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-royal to-gold-champagne">
            3D VIEW
          </h2>
          <p className="text-gray-400 text-sm tracking-widest mt-4 font-light">
            Coming soon for this saree.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 rounded-full border border-gold-royal/50 text-gold-royal hover:bg-gold-royal/10 transition-all duration-300 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const getModelPath = (type) => {
    const basePath = '/models/mannequin-';
    return `${basePath}${type}.glb`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      {/* Royal Glass Container */}
      <div className="relative w-full max-w-5xl h-[90vh] rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl shadow-[#d4af37]/10 glass-royal p-4">

        {/* Close Button – Gold on hover */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 text-gray-400 hover:text-gold-royal transition-colors duration-300 text-3xl font-light"
        >
          ✕
        </button>

        {/* Body Type Selector – Gold Accents */}
        <div className="absolute top-4 left-4 z-30 flex gap-3">
          {['slim', 'fat', 'athletic'].map((type) => (
            <button
              key={type}
              onClick={() => setBodyType(type)}
              className={`px-4 py-2 text-xs uppercase tracking-widest rounded-full border transition-all duration-300 ${
                bodyType === type
                  ? 'bg-gradient-to-r from-gold-royal to-gold-champagne text-black border-transparent shadow-lg shadow-gold-royal/30'
                  : 'bg-transparent text-gray-300 border-gold-royal/40 hover:border-gold-royal hover:text-gold-royal'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 3D Canvas */}
        <div className="w-full h-full rounded-xl overflow-hidden relative">
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center text-gold-royal/60 text-sm tracking-widest font-light animate-pulse">
                LOADING 3D MODEL...
              </div>
            }
          >
            <Canvas camera={{ position: [0, 0.5, 5], fov: 45 }}>
              <ambientLight intensity={0.6} />
              <spotLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, -5, -5]} intensity={0.5} />
              <Model modelPath={getModelPath(bodyType)} />
              <OrbitControls
                enableZoom={true}
                enableRotate={true}
                minDistance={2}
                maxDistance={10}
                target={[0, 0.5, 0]}
              />
              <Environment preset="studio" />
            </Canvas>
          </Suspense>
        </div>

        {/* Instructions – Gold */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gold-royal/50 text-xs tracking-widest font-light z-20">
          DRAG TO ROTATE · SCROLL TO ZOOM
        </div>
      </div>
    </div>
  );
};

export default Product3DViewer;