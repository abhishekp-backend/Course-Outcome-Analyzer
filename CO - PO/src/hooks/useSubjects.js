import { useSelector, useDispatch } from 'react-redux';
import {
  fetchSubjects,
  clearSubjectError,
  getSubject,
  fetchCO as fetchCOs
} from '../store/slices/subjectSlice';

export const useSubjects = () => {
  const dispatch = useDispatch();
  const { subjects, loading, error, isSubjectFetched, isSubjectFetching, isCOFetched, loadingCO } = useSelector((state) => state.subjects);

  const fetchAllSubject = async()=>{
    await dispatch(fetchSubjects())
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
        dispatch(fetchCOs(subjectId));
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