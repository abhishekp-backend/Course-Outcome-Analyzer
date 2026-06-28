import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addStudent,
  updateStudentMarks,
  deleteStudent,
  clearStudentError,
  fetchStudentByPRN,
  uploadExcel,
  fetchStudentsBySubject
} from '../store/slices/studentSlice';
import {clearSingleStudent} from "../store/slices/studentSlice"
import { useNavigate } from 'react-router-dom';

export const useStudents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { students, loading, error } = useSelector((state) => state.students);

  const fetchStudentsOfSubject = async({classId})=>{
    const response = await dispatch(fetchStudentsBySubject({classId, }));
    if ([401, 403].includes(response?.data?.payload?.status)) {
      navigate("/");
    }
  }

  const fetchOneStudent = async (data) => {
    dispatch(clearSingleStudent())
    dispatch(fetchStudentByPRN(data))
  }

  const createStudent = async (studentData) => {
    try {
      await dispatch(addStudent(studentData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };


  const removeStudent = async (id) => {
    try {
      await dispatch(deleteStudent(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const updateMarks = async(id)=>{
    try{
      await dispatch(updateStudentMarks(id)).unwrap()
      return {success:true}
    } catch (error) {
      return {success: false, error}
    }
  }

  const handleUpload = (files, id) => {
    dispatch(uploadExcel({files, id}))
  }

  const clearError = () => {
    dispatch(clearStudentError());
  };

  return {
    students,
    loading,
    error,
    createStudent,
    removeStudent,
    clearError,
    updateMarks,
    fetchStudentsOfSubject,
    fetchOneStudent,
    handleUpload
  };
};
