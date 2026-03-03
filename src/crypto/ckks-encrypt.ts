import { getSealContext } from './seal-context';

export const encryptData = async (
    data: Float64Array,
    publicKeyBase64: string
): Promise<string> => {
    const { seal, context } = await getSealContext();

    // Load public key
    const publicKey = seal.PublicKey();
    publicKey.load(context, publicKeyBase64);

    // Create Encoder and Encryptor
    const encoder = seal.CKKSEncoder(context);
    const encryptor = seal.Encryptor(context, publicKey);

    // Encode data. The scale is 2^40.
    const scale = Math.pow(2, 40);
    const plainText = encoder.encode(data, scale);

    // Encrypt
    const cipherText = encryptor.encrypt(plainText);

    // Serialize Ciphertext to string
    const cipherTextBase64 = cipherText.save();

    // Cleanup
    plainText.delete();
    cipherText.delete();
    encoder.delete();
    encryptor.delete();
    publicKey.delete();

    return cipherTextBase64;
};
