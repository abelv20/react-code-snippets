import { normalize, schema } from 'normalizr';
import { put, call, cancel, takeLatest } from 'redux-saga/effects';

import { setFavoritePagination } from 'redux/app/actions';

import {
  LOAD_CASE_SUCCESS,
  LOAD_CASE_FAULTS_SUCCESS,
  LOAD_CASE_NOTES_SUCCESS,
  LOAD_CASES_SUCCESS,
  POST_CASE_NOTE,
  UPDATE_CASE_NOTE,
  UPDATE_CASE_REQUEST,
} from '../constants';

import {
  addOrUpdateCurrentCase,
  addOrUpdateCases,
  loadCase,
  loadCaseNotes,
  setCurrentCaseFaults,
  setCurrentCaseNotes,
  updateCaseSuccess,
  updateCaseFailure,
} from './actions';

import {
  postCaseNote,
  updateCaseNote,
  updateCase,
} from './api';

/* --------------------- Define the shape of the responses with normalizr ----------------------- */

// Define the schemas found within a case. Each schema defines an object within the case response
// that would be best stored separately and linked to the case. Typically, this will mean objects
// that include an id key.
const asset = new schema.Entity('asset');
const serviceProvider = new schema.Entity('serviceProvider');

// Define the case schema. This tells normalizr that these schemas will be found within the body of
// a case.
const caseSchema = new schema.Entity('case', {
  serviceProvider,
  asset,
});

// Define the cases schema. This tells normalizr that the cases body will be an array of cases.
const casesSchema = [caseSchema];

/* ---------------------------------------------------------------------------------------------- */

/**
 * Given a single-case JSON response body (from a case fetch or case update), normalize
 * the data and update the matching entities in the Redux store with the new data.
 */
function* processUpdatedCase(response) {
  const normalizedData = yield call(normalize, response.body, caseSchema);
  yield put(addOrUpdateCurrentCase(normalizedData));
  return normalizedData;
}

// worker sagas
function* loadCaseSuccessWorker({ payload: response }) {
  yield call(processUpdatedCase, response);
}

function* loadCaseFaultsSuccessWorker({ payload: response }) {
  const sortedData = response.body.sort((a, b) => (a.reportedAt > b.reportedAt ? 1 : -1));
  yield put(setCurrentCaseFaults(sortedData));
}

function* loadCaseNotesSuccessWorker({ payload: response }) {
  const sortedData = response.body.sort((a, b) => (a.sentAt > b.sentAt ? 1 : -1));
  yield put(setCurrentCaseNotes(sortedData));
}

function* loadCasesSuccessWorker({ payload: response }) {
  const normalizedData = yield call(normalize, response.body, casesSchema);
  const pagination = {
    latestPage: response.headers.get('x-page'),
    perPage: response.headers.get('x-per-page'),
    totalCount: response.headers.get('x-total-count'),
    totalPages: response.headers.get('x-total-pages'),
  };

  yield put(addOrUpdateCases(normalizedData));
  yield put(setFavoritePagination(pagination));
}

function* postCaseNoteWorker({ payload }) {
  const { error } = yield call(postCaseNote, payload);
  if (error) { yield cancel(); }
  yield put(loadCase(payload));
  yield put(loadCaseNotes(payload));
}

function* updateCaseNoteWorker({ payload }) {
  const { error } = yield call(updateCaseNote, payload);
  if (error) { yield cancel(); }
  yield put(loadCase(payload));
  yield put(loadCaseNotes(payload));
}

function* updateCaseWorker({ payload }) {
  const { response, error } = yield call(updateCase, payload);
  if (error) {
    put(updateCaseFailure(error));
    yield cancel();
  }
  const normalizedData = yield call(processUpdatedCase, response);
  yield put(updateCaseSuccess(normalizedData));
}

// watcher sagas
export function* loadCaseSuccessWatcher() {
  yield takeLatest(LOAD_CASE_SUCCESS, loadCaseSuccessWorker);
}

export function* loadCaseFaultsSuccessWatcher() {
  yield takeLatest(LOAD_CASE_FAULTS_SUCCESS, loadCaseFaultsSuccessWorker);
}

export function* loadCaseNotesSuccessWatcher() {
  yield takeLatest(LOAD_CASE_NOTES_SUCCESS, loadCaseNotesSuccessWorker);
}

export function* loadCasesSuccessWatcher() {
  yield takeLatest(LOAD_CASES_SUCCESS, loadCasesSuccessWorker);
}

export function* postCaseNoteWatcher() {
  yield takeLatest(POST_CASE_NOTE, postCaseNoteWorker);
}

export function* updateCaseNoteWatcher() {
  yield takeLatest(UPDATE_CASE_NOTE, updateCaseNoteWorker);
}

export function* updateCaseWatcher() {
  yield takeLatest(UPDATE_CASE_REQUEST, updateCaseWorker);
}

// export all of the sagas.
export default [
  loadCaseSuccessWatcher(),
  loadCaseFaultsSuccessWatcher(),
  loadCaseNotesSuccessWatcher(),
  loadCasesSuccessWatcher(),
  postCaseNoteWatcher(),
  updateCaseNoteWatcher(),
  updateCaseWatcher(),
];
