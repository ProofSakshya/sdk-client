export interface VerificationRequest {
    publicKeyBase64: string;
    c_doc: string;
    c_bio: string;
}

export interface VerificationResponse {
    success: boolean;
    status: string;
    txHash?: string;
}

export const submitVerification = async (
    payload: VerificationRequest
): Promise<VerificationResponse> => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        // Simulating response for UI testing until backend is built
        return {
            success: true,
            status: 'pending-fhe-verification',
        };
    }
};
