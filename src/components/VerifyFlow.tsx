import { useState } from 'react';
import { generateKeys, encryptData } from '../crypto';
import { captureLivenessAndDocument } from '../liveness/detector';
import { submitVerification } from '../api/verify-client';

type Step = 'idle' | 'keys' | 'liveness' | 'encrypting' | 'submitting' | 'done';

export const VerifyFlow = () => {
    const [step, setStep] = useState<Step>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [txHash, setTxHash] = useState<string | null>(null);

    const addLog = (msg: string) => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const startVerification = async () => {
        try {
            setStep('keys');
            addLog('Generating CKKS Keys (Ring N=32768, ~880 bits)...');
            const { publicKeyBase64 } = await generateKeys();
            addLog('✓ Keys generated securely on-device.');

            setStep('liveness');
            addLog('Capturing Document and Selfie for Liveness...');
            const livenessResult = await captureLivenessAndDocument();
            addLog('✓ Facial embeddings extracted.');

            setStep('encrypting');
            addLog('Encrypting embeddings via FHE (CKKS)...');

            const c_doc = await encryptData(livenessResult.documentImage, publicKeyBase64);
            addLog('✓ Document ciphertexts ready.');

            const c_bio = await encryptData(livenessResult.selfieImage, publicKeyBase64);
            addLog('✓ Biometric ciphertexts ready.');

            setStep('submitting');
            addLog(`Submitting ciphertexts and PubKey to TEE Gateway...`);
            const response = await submitVerification({
                publicKeyBase64,
                c_doc,
                c_bio
            });

            if (response.success) {
                addLog(`✓ ZKP Generated. Solana Verification Transaction Submitted!`);
                if (response.txHash) setTxHash(response.txHash);
                setStep('done');
            }

        } catch (e: any) {
            addLog(`❌ Error: ${e.message}`);
            setStep('idle');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto glass-panel rounded-2xl p-8 mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                Zero-Trust KYC Verification
            </h2>

            {step === 'idle' ? (
                <div className="flex justify-center my-8">
                    <button
                        onClick={startVerification}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all pulse-ring cursor-pointer"
                    >
                        Start Encrypted Verification
                    </button>
                </div>
            ) : (
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2 px-2">
                        <span className={step === 'keys' ? 'text-blue-400 font-bold' : ''}>KeyGen</span>
                        <span className={step === 'liveness' ? 'text-blue-400 font-bold' : ''}>Capture</span>
                        <span className={step === 'encrypting' ? 'text-blue-400 font-bold' : ''}>Encrypt</span>
                        <span className={step === 'submitting' ? 'text-blue-400 font-bold' : ''}>Submit</span>
                        <span className={step === 'done' ? 'text-green-400 font-bold' : ''}>Done</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-500 ease-out"
                            style={{
                                width: `${step === 'keys' ? '20%' :
                                    step === 'liveness' ? '40%' :
                                        step === 'encrypting' ? '60%' :
                                            step === 'submitting' ? '80%' : '100%'
                                    }`
                            }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-y-auto h-64 border border-gray-800">
                {logs.length === 0 && <span className="text-gray-500">Awaiting action...</span>}
                {logs.map((log, i) => (
                    <div key={i} className="mb-1 text-green-400 opacity-90">
                        {log}
                    </div>
                ))}
            </div>

            {step === 'done' && (
                <div className="mt-6 p-4 rounded-lg bg-green-900/40 border border-green-500/50 text-center text-green-300">
                    <h3 className="font-bold text-lg mb-2">Verification Complete</h3>
                    <p>Your zero-knowledge proof has been verified on-chain.</p>
                    {txHash && (
                        <p className="mt-2 text-xs truncate">Tx: {txHash}</p>
                    )}
                </div>
            )}
        </div>
    );
};
