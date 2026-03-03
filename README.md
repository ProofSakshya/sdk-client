# Sakshya SDK Client

A React and TypeScript SDK for secure computation and interaction within the Sakshya Protocol. This client-side SDK provides utilities for encrypting biometric data using Fully Homomorphic Encryption (FHE) via `node-seal`, integrating seamlessly into React applications for liveness and biometric matching over the Sakshya TEE and FHE gateways.

## Features

- **FHE Data Encryption**: Utilizes Microsoft SEAL (via `node-seal`) for client-side CKKS scheme encryption.
- **React Integrations**: High-level hooks and components for simplified interactions.
- **Secure Enclave Interface**: Communicates with the Sakshya TEE Gateway for provisioning and result verification.
- **Type-safe**: Exported with complete TypeScript definitions.

## Setup and Development

This project leverages [Vite](https://vitejs.dev/) with React and Tailwind CSS for rapid development.

### Installation

```bash
npm install
```

### Scripts

- `npm run dev`: Starts the local Vite development server.
- `npm run build`: Compiles TypeScript and builds the production bundles.
- `npm run lint`: Runs ESLint to check for code issues.
- `npm run preview`: Previews the local production build.

## Usage

```typescript
import { initializeFHE, encryptBiometric } from 'sakshya-sdk-client';

// Initialize the FHE client and encrypt data
// Complete SDK usage examples coming soon.
```
