import { fromJS, List, Map, OrderedSet } from 'immutable';
import { handleActions, combineActions } from 'redux-actions';

import {
  ADD_OR_UPDATE_CASES,
  ADD_OR_UPDATE_CURRENT_CASE,
  CLEAR_CASE_RECIPIENTS,
  LOGOUT,
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
  RESET_FAVORITES,
  SET_CURRENT_CASE,
  SET_CURRENT_CASE_FAULTS,
  SET_CURRENT_CASE_NOTES,
  UPDATE_CASE_REQUEST,
  UPDATE_CASE_SUCCESS,
  UPDATE_CASE_FAILURE,
} from '../constants';

export const initialState = fromJS({
  responseIds: OrderedSet(),
  byId: {},
  currentCaseId: '',
  requesting: false,
  error: {},
});

function addOrUpdateCasesHandler(state, action) {
  const {
    entities: {
      case: newCases = {},
    } = {},
    result = [],
  } = action.payload;

  const currentAllIds = state.get('responseIds');
  const newAllIds = currentAllIds.concat(result);

  const currentById = state.get('byId');
  const newById = currentById.merge(currentById, { ...newCases });

  return state
    .set('responseIds', newAllIds)
    .set('byId', newById);
}

function addOrUpdateCurrentCaseHandler(state, action) {
  const {
    entities: {
      case: newCases = {},
    } = {},
  } = action.payload;
  const caseId = Object.keys(newCases)[0];

  const currentCaseInfo = state.getIn(['byId', caseId]) || Map();
  const newCaseInfo = currentCaseInfo.merge(currentCaseInfo, newCases[caseId]);

  return state
    .update('responseIds', orderedSet => orderedSet.add(caseId).filter(id => !!id))
    .update('byId', map => map.set(caseId, newCaseInfo).filter((val, key) => !!key))
    .set('currentCaseId', caseId)
    .set('requesting', false);
}

function clearCaseRecipientsHandler(state) {
  return state.set('caseRecipients', Map());
}

function loadCaseRequestHandler(state) {
  return state
    .set('caseRequesting', true)
    .set('error', Map());
}

function loadCaseSuccessHandler(state) {
  return state
    .set('caseRequesting', false)
    .set('error', Map());
}

function loadCaseFailureHandler(state, action) {
  return state
    .set('caseRequesting', false)
    .set('error', action.payload.error);
}

function loadCaseFaultsRequestHandler(state) {
  return state
    .set('caseFaultsRequesting', true)
    .set('error', Map());
}

function loadCaseFaultsSuccessHandler(state) {
  return state
    .set('caseFaultsRequesting', false)
    .set('error', Map());
}

function loadCaseFaultsFailureHandler(state, action) {
  return state
    .set('caseFaultsRequesting', false)
    .set('error', action.payload.error);
}

function loadCaseNotesRequestHandler(state) {
  return state
    .set('caseNotesRequesting', true)
    .set('error', Map());
}

function loadCaseNotesSuccessHandler(state) {
  return state
    .set('caseNotesRequesting', false)
    .set('error', Map());
}

function loadCaseNotesFailureHandler(state, action) {
  return state
    .set('caseNotesRequesting', false)
    .set('error', action.payload.error);
}

function loadCaseRecipientsRequestHandler(state) {
  return state.set('caseRecipients', fromJS({
    requesting: true,
    error: null,
    data: [],
  }));
}

function loadCaseRecipientsSuccessHandler(state, action) {
  return state.set('caseRecipients', fromJS({
    requesting: false,
    error: null,
    data: action.payload.body,
  }));
}

function loadCaseRecipientsFailureHandler(state, action) {
  return state.set('caseRecipients', fromJS({
    requesting: false,
    error: action.payload,
    data: [],
  }));
}

function loadCasesRequestHandler(state) {
  return state
    .set('requesting', true)
    .set('error', Map());
}

function loadCasesSuccessHandler(state) {
  return state
    .set('requesting', false)
    .set('error', Map());
}

function loadCasesFailureHandler(state, action) {
  return state
    .set('requesting', false)
    .set('error', action.payload.error);
}

function resetState(state) {
  return state
    .set('responseIds', OrderedSet())
    .set('byId', Map())
    .set('currentCaseId', '')
    .set('currentCaseFaults', List())
    .set('currentCaseNotes', List())
    .set('requesting', false);
}

function setCurrentCaseHandler(state, action) {
  return state
    .set('currentCaseId', action.payload)
    .set('error', Map());
}

function setCurrentCaseFaultsHandler(state, action) {
  return state.set('currentCaseFaults', fromJS(action.payload.currentCaseFaults));
}

function setCurrentCaseNotesHandler(state, action) {
  return state.set('currentCaseNotes', fromJS(action.payload.currentCaseNotes));
}

function updateCaseRequestHandler(state) {
  return state.set('requesting', true);
}

function updateCaseSuccessHandler(state, action) {
  return addOrUpdateCurrentCaseHandler(state, action);
}

function updateCaseFailureHandler(state, action) {
  return state.set('requesting', false)
    .set('error', fromJS(action));
}

export default handleActions({
  [ADD_OR_UPDATE_CASES]: addOrUpdateCasesHandler,
  [ADD_OR_UPDATE_CURRENT_CASE]: addOrUpdateCurrentCaseHandler,
  [CLEAR_CASE_RECIPIENTS]: clearCaseRecipientsHandler,
  [combineActions(RESET_FAVORITES, LOGOUT)]: resetState,
  [LOAD_CASE_REQUEST]: loadCaseRequestHandler,
  [LOAD_CASE_SUCCESS]: loadCaseSuccessHandler,
  [LOAD_CASE_FAILURE]: loadCaseFailureHandler,
  [LOAD_CASE_FAULTS_REQUEST]: loadCaseFaultsRequestHandler,
  [LOAD_CASE_FAULTS_SUCCESS]: loadCaseFaultsSuccessHandler,
  [LOAD_CASE_FAULTS_FAILURE]: loadCaseFaultsFailureHandler,
  [LOAD_CASE_NOTES_REQUEST]: loadCaseNotesRequestHandler,
  [LOAD_CASE_NOTES_SUCCESS]: loadCaseNotesSuccessHandler,
  [LOAD_CASE_NOTES_FAILURE]: loadCaseNotesFailureHandler,
  [LOAD_CASE_REQUEST]: loadCaseRequestHandler,
  [LOAD_CASE_SUCCESS]: loadCaseSuccessHandler,
  [LOAD_CASE_FAILURE]: loadCaseFailureHandler,
  [LOAD_CASE_RECIPIENTS_REQUEST]: loadCaseRecipientsRequestHandler,
  [LOAD_CASE_RECIPIENTS_SUCCESS]: loadCaseRecipientsSuccessHandler,
  [LOAD_CASE_RECIPIENTS_FAILURE]: loadCaseRecipientsFailureHandler,
  [LOAD_CASES_REQUEST]: loadCasesRequestHandler,
  [LOAD_CASES_SUCCESS]: loadCasesSuccessHandler,
  [LOAD_CASES_FAILURE]: loadCasesFailureHandler,
  [SET_CURRENT_CASE]: setCurrentCaseHandler,
  [SET_CURRENT_CASE_FAULTS]: setCurrentCaseFaultsHandler,
  [SET_CURRENT_CASE_NOTES]: setCurrentCaseNotesHandler,
  [UPDATE_CASE_REQUEST]: updateCaseRequestHandler,
  [UPDATE_CASE_SUCCESS]: updateCaseSuccessHandler,
  [UPDATE_CASE_FAILURE]: updateCaseFailureHandler,
}, initialState);
