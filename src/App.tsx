import { VerifyFlow } from './components/VerifyFlow';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-950 p-6">
      <header className="w-full max-w-4xl py-6 flex justify-between items-center mb-8 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sakshya <span className="text-gray-500 font-normal">SDK</span></h1>
        </div>
        <div className="flex gap-4 text-sm font-medium text-gray-400">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> FHE Engine
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> ZKP Verifier
          </span>
        </div>
      </header>

      <main className="w-full max-w-4xl flex-1">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <p className="text-gray-400 text-lg leading-relaxed">
            Privacy-preserving identity verification. Your sensitive data never leaves this device.
            All processing happens over <strong className="text-blue-400">ciphertexts</strong> via Fully Homomorphic Encryption.
          </p>
        </div>

        <VerifyFlow />
      </main>

      <footer className="w-full max-w-4xl py-6 mt-12 text-center text-sm text-gray-600 border-t border-gray-900">
        Built with Node-Seal, Rust, and Circom.
      </footer>
    </div>
  );
}

export default App;
