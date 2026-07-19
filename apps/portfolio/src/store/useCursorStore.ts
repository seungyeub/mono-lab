import { create } from 'zustand';

type CursorType = 'default' | 'pointer' | 'view' | 'grab';

interface CursorState {
  type: CursorType;
  setType: (type: CursorType) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  type: 'default',
  setType: (type) => set({ type }),
}));
