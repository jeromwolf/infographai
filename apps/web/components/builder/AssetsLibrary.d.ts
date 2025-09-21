import React from 'react';
interface Asset {
    id: string;
    name: string;
    type: 'image' | 'icon' | 'shape' | 'animation';
    path: string;
    thumbnail?: string;
}
interface AssetsLibraryProps {
    onAssetSelect?: (asset: Asset) => void;
}
declare const AssetsLibrary: React.FC<AssetsLibraryProps>;
export default AssetsLibrary;
//# sourceMappingURL=AssetsLibrary.d.ts.map