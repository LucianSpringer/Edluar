import { create } from 'zustand';

interface SiteState {
    blocks: any[];
    branding: { color: string; font: string };
    addBlock: (type: string) => void;
    moveBlock: (fromIndex: number, toIndex: number) => void;
    updateBlockContent: (id: string, content: any) => void;
    setBranding: (branding: Partial<{ color: string; font: string }>) => void;
}

export const useCareerSiteStore = create<SiteState>((set) => ({
    blocks: [],
    branding: { color: '#2F3E30', font: 'Inter' },

    addBlock: (type) => set((state) => ({
        blocks: [...state.blocks, { id: Date.now().toString(), type, content: {} }]
    })),

    moveBlock: (fromIndex, toIndex) => set((state) => {
        const newBlocks = [...state.blocks];
        const [movedBlock] = newBlocks.splice(fromIndex, 1);
        newBlocks.splice(toIndex, 0, movedBlock);
        return { blocks: newBlocks };
    }),

    updateBlockContent: (id, content) => set((state) => ({
        blocks: state.blocks.map((b) => (b.id === id ? { ...b, content: { ...b.content, ...content } } : b))
    })),

    setBranding: (newBranding) => set((state) => ({
        branding: { ...state.branding, ...newBranding }
    }))
}));
