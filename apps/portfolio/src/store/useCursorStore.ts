import { create } from 'zustand';

type CursorType = 'default' | 'pointer' | 'view';

interface CursorState {
  type: CursorType;
  setType: (type: CursorType) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  type: 'default',
  setType: (type) => set({ type }),
}));
