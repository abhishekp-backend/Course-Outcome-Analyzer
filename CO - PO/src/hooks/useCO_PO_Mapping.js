import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMappings,
  updateMapping,
  deleteMapping,
  calculatePOAttainment,
  clearMappingError,
} from "../store/slices/coPoMappingSlice";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

export const useCO_PO_Mapping = (subjectId) => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { mappings, poAttainment, loading, error } = useSelector(
    (state) => state.coPoMappings,
  );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!subjectId) return;

  //     const response = await dispatch(fetchMappings(subjectId));

  //     if (
  //       fetchMappings.rejected.match(response) &&
  //       [401, 403].includes(response.payload?.status)
  //     ) {
  //       navigate("/");
  //     }
  //   };

  //   fetchData();
  // }, [subjectId, dispatch, navigate]);

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

  const calculatePOAttainmentFromCO = async () => {
    try {
      await dispatch(
        fetchMappings(subjectId),
      ).unwrap();
      toast.success("Successfully attained!")
      return { success: true };
    } catch (error) {
      console.log("[ERROR]: ", error);
      toast.error("Internal Attainment Error!")
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
    clearError,
  };
};
