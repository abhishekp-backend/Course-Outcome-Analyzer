import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMappings,
  updateMapping,
  deleteMapping,
  calculatePOAttainment,
  clearMappingError,
} from '../store/slices/coPoMappingSlice';

export const useCO_PO_Mapping = (subjectId) => {
  const dispatch = useDispatch();
  const { mappings, poAttainment, loading, error } = useSelector((state) => state.coPoMappings);

  useEffect(() => {
    if (subjectId) {
      dispatch(fetchMappings(subjectId));
    }
  }, [subjectId, dispatch]);


  const updateCO_PO_Mapping = async (id, correlationLevel) => {
    try {
      await dispatch(updateMapping({ id, correlationLevel })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const removeMapping = async (id) => {
    try {
      await dispatch(deleteMapping(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const calculatePOAttainmentFromCO = async (coAttainment) => {
    try {
      await dispatch(calculatePOAttainment({ subjectId, coAttainment })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const clearError = () => {
    dispatch(clearMappingError());
  };

  return {
    mappings,
    poAttainment,
    loading,
    error,
    updateCO_PO_Mapping,
    removeMapping,
    calculatePOAttainmentFromCO,
    clearError
  };
};

