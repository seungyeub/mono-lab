import { useCursorStore } from './useCursorStore';

describe('useCursorStore', () => {
  it('초기 커서 타입은 "default"여야 한다', () => {
    expect(useCursorStore.getState().type).toBe('default');
  });

  it('setType 메서드를 호출하면 커서 타입이 변경되어야 한다', () => {
    // pointer로 변경
    useCursorStore.getState().setType('pointer');
    expect(useCursorStore.getState().type).toBe('pointer');

    // view로 변경
    useCursorStore.getState().setType('view');
    expect(useCursorStore.getState().type).toBe('view');

    // drag로 변경
    useCursorStore.getState().setType('drag');
    expect(useCursorStore.getState().type).toBe('drag');
  });
});
