import { fromJS, OrderedSet, Map } from 'immutable';

import { test, expect } from '__tests__/helpers/test-setup';

import * as actions from '../actions';
import reducer, { initialState } from '../reducer';
import {
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
} from '../../constants';

test('calling addOrUpdateCases action with no data does not change responseIds or byId', () => {
  const action = actions.addOrUpdateCases({ payload: {} });
  const state = fromJS({
    responseIds: OrderedSet(['123', '321']),
    byId: {
      123: { id: 123 },
      321: { id: 321 },
    },
  });
  const newState = reducer(state, action);
  expect(newState.get('responseIds')).toEqual(state.get('responseIds'));
  expect(newState.get('byId')).toEqual(state.get('byId'));
});

test('calling addOrUpdateCurrentCase action with no data does not change responseIds or byId', () => {
  const action = actions.addOrUpdateCurrentCase({ payload: {} });
  const state = fromJS({
    responseIds: OrderedSet(['123', '321']),
    byId: {
      123: { id: 123 },
      321: { id: 321 },
    },
  });
  const newState = reducer(state, action);
  expect(newState.get('responseIds')).toEqual(state.get('responseIds'));
  expect(newState.get('byId')).toEqual(state.get('byId'));
});

test('calling setCurrentCase action updates cases.currentCaseId in state', () => {
  const currentCaseId = '123';

  const action = actions.setCurrentCase(currentCaseId);
  const newState = reducer(initialState, action);

  expect(newState.get('currentCaseId')).toEqual(currentCaseId);
});

// --------------------- Case ----------------------

test('action with type LOAD_CASE_REQUEST sets caseRequesting to true', () => {
  const newState = reducer(initialState, { type: LOAD_CASE_REQUEST });
  expect(newState.get('caseRequesting')).toEqual(true);
});

test('action with type LOAD_CASE_SUCCESS sets caseRequesting to false in state', () => {
  const testState = initialState.set('caseRequesting', true);
  const newState = reducer(testState, { type: LOAD_CASE_SUCCESS });
  expect(newState.get('caseRequesting')).toEqual(false);
});

test('action with type LOAD_CASE_FAILURE sets requesting to false and saves error', () => {
  const testState = initialState.set('caseRequesting', true);
  const action = {
    type: LOAD_CASE_FAILURE,
    error: true,
    payload: { error: 'load case failure' },
  };
  const newState = reducer(testState, action);
  expect(newState.get('caseRequesting')).toEqual(false);
  expect(newState.get('error')).toEqual(action.payload.error);
});

// --------------------- Case faults ----------------------

test('action with type LOAD_CASE_FAULTS_REQUEST sets caseFaultsRequesting to true', () => {
  const newState = reducer(initialState, { type: LOAD_CASE_FAULTS_REQUEST });
  expect(newState.get('caseFaultsRequesting')).toEqual(true);
});

test('action with type LOAD_CASE_FAULTS_SUCCESS sets caseFaultsRequesting to false in state', () => {
  const testState = initialState.set('caseFaultsRequesting', true);
  const newState = reducer(testState, { type: LOAD_CASE_FAULTS_SUCCESS });
  expect(newState.get('caseFaultsRequesting')).toEqual(false);
});

test('action with type LOAD_CASE_FAULTS_FAILURE sets requesting to false and saves error', () => {
  const testState = initialState.set('caseFaultsRequesting', true);
  const action = {
    type: LOAD_CASE_FAULTS_FAILURE,
    error: true,
    payload: { error: 'load case faults failure' },
  };
  const newState = reducer(testState, action);
  expect(newState.get('caseFaultsRequesting')).toEqual(false);
  expect(newState.get('error')).toEqual(action.payload.error);
});

// --------------------- Case notes ----------------------

test('action with type LOAD_CASE_NOTES_REQUEST sets caseNotesRequesting to true', () => {
  const newState = reducer(initialState, { type: LOAD_CASE_NOTES_REQUEST });
  expect(newState.get('caseNotesRequesting')).toEqual(true);
});

test('action with type LOAD_CASE_NOTES_SUCCESS sets caseNotesRequesting to false in state', () => {
  const testState = initialState.set('caseNotesRequesting', true);
  const newState = reducer(testState, { type: LOAD_CASE_NOTES_SUCCESS });
  expect(newState.get('caseNotesRequesting')).toEqual(false);
});

test('action with type LOAD_CASE_NOTES_FAILURE sets requesting to false and saves error', () => {
  const testState = initialState.set('caseNotesRequesting', true);
  const action = {
    type: LOAD_CASE_NOTES_FAILURE,
    error: true,
    payload: { error: 'load case notes failure' },
  };
  const newState = reducer(testState, action);
  expect(newState.get('caseNotesRequesting')).toEqual(false);
  expect(newState.get('error')).toEqual(action.payload.error);
});

// --------------------- Case recipients ----------------------

test('action with type LOAD_CASE_RECIPIENTS_REQUEST updates cases.caseRecipients in state', () => {
  const newState = reducer(initialState, { type: LOAD_CASE_RECIPIENTS_REQUEST });
  expect(newState.get('caseRecipients')).toEqual(fromJS({
    requesting: true,
    error: null,
    data: [],
  }));
});

test('action with type LOAD_CASE_RECIPIENTS_SUCCESS updates cases.caseRecipients in state', () => {
  const response = {
    body: {
      testField: 'test data',
    },
  };
  const action = {
    type: LOAD_CASE_RECIPIENTS_SUCCESS,
    payload: response,
  };
  const newState = reducer(initialState, action);

  expect(newState.get('caseRecipients')).toEqual(fromJS({
    requesting: false,
    error: null,
    data: response.body,
  }));
});

test('action with type LOAD_CASE_RECIPIENTS_FAILURE updates cases.caseRecipients in state', () => {
  const error = {
    code: 500,
  };
  const action = {
    type: LOAD_CASE_RECIPIENTS_FAILURE,
    payload: error,
  };
  const newState = reducer(initialState, action);

  expect(newState.get('caseRecipients')).toEqual(fromJS({
    requesting: false,
    error,
    data: [],
  }));
});

test('calling clearCaseRecipients action updates cases.caseRecipients in state', () => {
  const action = actions.clearCaseRecipients();
  const newState = reducer(initialState, action);

  expect(newState.get('caseRecipients')).toEqual(Map());
});

// ------------------------ Cases ------------------------

test('action with type LOAD_CASES_REQUEST sets requesting to true', () => {
  const newState = reducer(initialState, { type: LOAD_CASES_REQUEST });
  expect(newState.get('requesting')).toEqual(true);
});

test('action with type LOAD_CASES_SUCCESS sets requesting to false in state', () => {
  const testState = initialState.set('requesting', true);
  expect(testState.get('requesting')).toEqual(true);
  const newState = reducer(testState, { type: LOAD_CASES_SUCCESS });
  expect(newState.get('requesting')).toEqual(false);
});

test('action with type LOAD_CASES_FAILURE sets requesting to false and saves error', () => {
  const testState = initialState.set('requesting', true);
  expect(testState.get('requesting')).toEqual(true);
  const action = {
    type: LOAD_CASES_FAILURE,
    error: true,
    payload: { error: 'invalid query' },
  };
  const newState = reducer(testState, action);
  expect(newState.get('requesting')).toEqual(false);
  expect(newState.get('error')).toEqual(action.payload.error);
});

test('calling setCurrentCaseFaults action updates cases.currentCaseFaults in state', () => {
  const caseFaults = {
    sampleField: 'SampleData',
  };

  const action = actions.setCurrentCaseFaults(caseFaults);
  const newState = reducer(initialState, action);

  expect(newState.get('currentCaseFaults')).toEqual(Map(caseFaults));
});

test('calling updateCaseRequest action sets requesting to true in state', () => {
  const action = actions.updateCaseRequest();
  const newState = reducer(initialState, action);

  expect(newState.get('requesting')).toEqual(true);
});

test('calling updateCaseSuccess action sets requesting to false in state', () => {
  const action = actions.updateCaseSuccess({ payload: {} });
  const newState = reducer(initialState, action);

  expect(newState.get('requesting')).toEqual(false);
});

test('calling updateCaseFailure action sets requesting to false in state', () => {
  const action = actions.updateCaseFailure({ payload: {} });
  const newState = reducer(initialState, action);

  expect(newState.get('requesting')).toEqual(false);
});
