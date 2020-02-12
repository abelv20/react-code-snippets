import { createAction } from 'redux-actions';
import { createApiAction } from 'utils/redux-api-actions';

import {
  getCase,
  getCaseFaults,
  getCaseNotes,
  getCaseRecipients,
  getCases,
} from './api';

import {
  ADD_OR_UPDATE_CASES,
  ADD_OR_UPDATE_CURRENT_CASE,
  CLEAR_CASE_RECIPIENTS,
  LOAD_CASE_REQUEST,
  LOAD_CASE_SUCCESS,
  LOAD_CASE_FAILURE,
  LOAD_CASE_FAULTS_REQUEST,
  LOAD_CASE_FAULTS_SUCCESS,
  LOAD_CASE_FAULTS_FAILURE,
  LOAD_CASE_NOTES_REQUEST,
  LOAD_CASE_NOTES_SUCCESS,
  LOAD_CASE_NOTES_FAILURE,
  LOAD_CASE_RECIPIENTS_REQUEST,
  LOAD_CASE_RECIPIENTS_SUCCESS,
  LOAD_CASE_RECIPIENTS_FAILURE,
  LOAD_CASES_REQUEST,
  LOAD_CASES_SUCCESS,
  LOAD_CASES_FAILURE,
  POST_CASE_NOTE,
  RESET_FAVORITES,
  SET_CURRENT_CASE,
  SET_CURRENT_CASE_FAULTS,
  SET_CURRENT_CASE_NOTES,
  UPDATE_CASE_NOTE,
  UPDATE_CASE_REQUEST,
  UPDATE_CASE_SUCCESS,
  UPDATE_CASE_FAILURE,
} from '../constants';

// redux-actions allows us to create very versatile action creators in a single line.
export const addOrUpdateCases = createAction(ADD_OR_UPDATE_CASES);

export const addOrUpdateCurrentCase = createAction(ADD_OR_UPDATE_CURRENT_CASE);

export const clearCaseRecipients = createAction(CLEAR_CASE_RECIPIENTS);

export const clearCases = createAction(RESET_FAVORITES);

export const loadCase = createApiAction(
  [LOAD_CASE_REQUEST, LOAD_CASE_SUCCESS, LOAD_CASE_FAILURE],
  getCase,
);

export const loadCaseFaults = createApiAction(
  [LOAD_CASE_FAULTS_REQUEST, LOAD_CASE_FAULTS_SUCCESS, LOAD_CASE_FAULTS_FAILURE],
  getCaseFaults,
);

export const loadCaseNotes = createApiAction(
  [LOAD_CASE_NOTES_REQUEST, LOAD_CASE_NOTES_SUCCESS, LOAD_CASE_NOTES_FAILURE],
  getCaseNotes,
);

export const loadCaseRecipients = createApiAction(
  [LOAD_CASE_RECIPIENTS_REQUEST, LOAD_CASE_RECIPIENTS_SUCCESS, LOAD_CASE_RECIPIENTS_FAILURE],
  getCaseRecipients,
);

export const loadCases = createApiAction(
  [LOAD_CASES_REQUEST, LOAD_CASES_SUCCESS, LOAD_CASES_FAILURE],
  getCases,
);

// TODO: Success/Error handling should be added later
export const postCaseNote = createAction(POST_CASE_NOTE);

export const setCurrentCase = createAction(SET_CURRENT_CASE);

export const updateCaseNote = createAction(UPDATE_CASE_NOTE);

export const updateCaseRequest = createAction(UPDATE_CASE_REQUEST);

export const updateCaseSuccess = createAction(UPDATE_CASE_SUCCESS);

export const updateCaseFailure = createAction(UPDATE_CASE_FAILURE);

export const setCurrentCaseFaults = createAction(
  SET_CURRENT_CASE_FAULTS,
  currentCaseFaults => ({ currentCaseFaults }),
);

export const setCurrentCaseNotes = createAction(
  SET_CURRENT_CASE_NOTES,
  currentCaseNotes => ({ currentCaseNotes }),
);
