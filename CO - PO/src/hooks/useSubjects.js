import { useSelector, useDispatch } from 'react-redux';
import {
  fetchSubjects,
  clearSubjectError,
  getSubject,
  fetchCO as fetchCOs
} from '../store/slices/subjectSlice';
import { useNavigate } from 'react-router-dom';

export const useSubjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subjects, loading, error, isSubjectFetched, isSubjectFetching, isCOFetched, loadingCO } = useSelector((state) => state.subjects);

  const fetchAllSubject = async()=>{
    const response = await dispatch(fetchSubjects())
    if ([401, 403].includes(response?.data?.payload?.status)) {
      navigate("/");
    }
  }

  const getSubjectInfo = async(id)=>{
    try{
      await dispatch(getSubject(id)).unwrap();
      return {success:true};
    } catch (error) {
      return {success: false, error}
    }
  }

  const fetchCO = async(subjectId) => {
    try {
      if (!loadingCO) {
        const response = await dispatch(fetchCOs(subjectId));
        if ([401, 403]?.includes(response?.payload?.status)) {
          navigate("/");
        }
      }
    }
    catch (error) {
      return {success: false, error}
    }
  }
  const clearError = () => {
    dispatch(clearSubjectError());
  };

  return {
    subjects,
    loading,
    error,
    clearError,
    getSubjectInfo,
    fetchAllSubject,
    fetchCO,
    isSubjectFetched, isSubjectFetching,
    isCOFetched, loadingCO,
  };
};