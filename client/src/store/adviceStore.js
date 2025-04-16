import { create } from 'zustand';

const useAdviceStore = create((set) => ({
  loading: false,
  setLoading: (val) => set({ loading: val }),
  response: null,
  setResponse: (res) => set({ response: res }),
}));

export default useAdviceStore;
