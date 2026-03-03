import SEAL from 'node-seal';

let sealInstance: any | null = null;
let context: any | null = null;

export const getSealContext = async () => {
  if (sealInstance && context) return { seal: sealInstance, context };

  sealInstance = await SEAL();

  // Set up CKKS parameters
  const schemeType = sealInstance.SchemeType.ckks;
  const securityLevel = sealInstance.SecurityLevel.tc128;
  const polyModulusDegree = 32768; // N=32768

  // log2 q ≈ 880 bits for 128-bit security.
  // We use 60 for the first and lastprimes, and 40 for the intermediate primes.
  // 60 + 19 * 40 + 60 = 880 bits.
  const bitSizes = new Int32Array([60, ...Array(19).fill(40), 60]);

  const parms = sealInstance.EncryptionParameters(schemeType);
  parms.setPolyModulusDegree(polyModulusDegree);
  parms.setCoeffModulus(
    sealInstance.CoeffModulus.Create(polyModulusDegree, bitSizes)
  );

  context = sealInstance.Context(parms, true, securityLevel);

  if (!context.parametersSet()) {
    throw new Error('Could not set the SEAL parameters');
  }

  return { seal: sealInstance, context };
};
