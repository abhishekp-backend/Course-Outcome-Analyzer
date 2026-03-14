import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPOs,
  createPO,
  updatePO,
  deletePO,
  clearPOError
} from '../store/slices/poSlice';

export const usePO = () => {
  const dispatch = useDispatch();
  const { pos, loading, error } = useSelector((state) => state.pos);

  useEffect(() => {
    dispatch(fetchPOs());
  }, [dispatch]);

  const createProgramOutcome = async (poData) => {
    try {
      await dispatch(createPO(poData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const updateProgramOutcome = async (id, poData) => {
    try {
      await dispatch(updatePO({ id, poData })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const removePO = async (id) => {
    try {
      await dispatch(deletePO(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const clearError = () => {
    dispatch(clearPOError());
  };

  return {
    pos,
    loading,
    error,
    createProgramOutcome,
    updateProgramOutcome,
    removePO,
    clearError
  };
};

