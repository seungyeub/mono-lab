import { create } from 'zustand';

type CursorType = 'default' | 'pointer' | 'view' | 'drag';

interface CursorState {
  type: CursorType;
  setType: (type: CursorType) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  type: 'default',
  setType: (type) => set({ type }),
}));
