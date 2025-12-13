import { useEffect, useState } from 'react';

export const useBarcodeScanner = (onScan: (barcode: string) => void) => {
    const [barcode, setBarcode] = useState('');
    const [lastKeyTime, setLastKeyTime] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const currentTime = Date.now();

            // Ignore special keys except Enter
            if (e.key.length > 1 && e.key !== 'Enter') return;

            // If time between keys is too long, reset (manual typing vs scanner)
            // Scanners are very fast, usually < 30-50ms per char
            if (currentTime - lastKeyTime > 100) {
                setBarcode(e.key === 'Enter' ? '' : e.key);
            } else {
                if (e.key === 'Enter') {
                    if (barcode.length > 0) {
                        onScan(barcode);
                        setBarcode('');
                    }
                } else {
                    setBarcode(prev => prev + e.key);
                }
            }

            setLastKeyTime(currentTime);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [barcode, lastKeyTime, onScan]);
};
