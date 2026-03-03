import { getSealContext } from './seal-context';

export interface SakshyaKeys {
    publicKeyBase64: string;
    secretKeyBase64: string;
    relinKeysBase64: string;
}

export const generateKeys = async (): Promise<SakshyaKeys> => {
    const { seal, context } = await getSealContext();

    const keyGenerator = seal.KeyGenerator(context);

    const secretKey = keyGenerator.secretKey();
    const publicKey = keyGenerator.createPublicKey();
    const relinKeys = keyGenerator.createRelinKeys();

    // Serialize to base64
    const secretKeyBase64 = secretKey.save();
    const publicKeyBase64 = publicKey.save();
    const relinKeysBase64 = relinKeys.save();

    // Cleanup
    secretKey.delete();
    publicKey.delete();
    relinKeys.delete();
    keyGenerator.delete();

    return {
        publicKeyBase64,
        secretKeyBase64,
        relinKeysBase64
    };
};
