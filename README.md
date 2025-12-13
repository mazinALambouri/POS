# NexusPOS - Hybrid Point of Sale System

A full-stack, hybrid POS system designed for small to medium-sized retail businesses. It features a "Local-First" architecture ensuring full functionality offline, with automatic synchronization when online.

## Architecture

- **Frontend**: React (Vite), TypeScript, Tailwind CSS v4, Dexie.js (IndexedDB).
- **Backend**: Node.js, Express, TypeScript.
- **Database**: 
  - Local: IndexedDB (via Dexie.js)
  - Central: Mock In-Memory Store (easily replaceable with PostgreSQL).

## Features

- **Offline-First**: Full transaction capability without internet.
- **Auto-Sync**: Automatically uploads transactions and downloads product updates when connection is restored.
- **POS Terminal**: Product search, barcode scanning (mock), cart management, payment processing.
- **Dashboard**: Sales overview (placeholder).

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1.  **Install Client Dependencies**:
    ```bash
    cd client
    npm install
    ```

2.  **Install Server Dependencies**:
    ```bash
    cd server
    npm install
    ```

### Running the Application

1.  **Start the Backend Server**:
    ```bash
    cd server
    npm run dev
    ```
    Server runs at `http://localhost:3000`.

2.  **Start the Frontend Client**:
    ```bash
    cd client
    npm run dev
    ```
    Client runs at `http://localhost:5174`.

## Usage

1.  Open the client in your browser.
2.  If the product list is empty, click "Seed Demo Data" (or it might auto-seed if configured).
3.  Add items to the cart.
4.  Process a payment.
5.  Check the server console to see the transaction synced (if online).
6.  Go offline (disconnect network) and process transactions. Reconnect to see them sync.
