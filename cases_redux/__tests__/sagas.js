import { fromJS, OrderedSet, Map } from 'immutable';
import SagaTester from 'redux-saga-tester';
import { test, expect, spyOn } from '__tests__/helpers/test-setup';

import createReducer from 'setup/reducer';

import requestStatusMiddleware from 'redux/middleware/requestStatusMiddleware';

import * as actions from '../actions';
import * as api from '../api';
import {
  LOAD_CASE_REQUEST,
  LOAD_CASE_SUCCESS,
  LOAD_CASE_FAULTS_SUCCESS,
  LOAD_CASE_NOTES_SUCCESS,
  LOAD_CASES_SUCCESS,
  UPDATE_CASE_REQUEST,
} from '../../constants';
import * as sagas from '../sagas';

const initialState = fromJS({});
const reducers = createReducer();

function buildCase(caseId, assetId, serviceProviderId) {
  return {
    id: caseId,
    asset: {
      id: assetId,
    },
    serviceProvider: {
      id: serviceProviderId,
    },
  };
}

function buildCaseFaults() {
  return fromJS([
    {
      componentId: 'Component1',
      status: 'Status',
      reportedAt: 'DateTime3',
      ecu: 'ECU',
      fmi: 'FMI',
      count: 10,
      severity: {
        color: 'red',
        level: 1,
      },
    },
    {
      componentId: 'Component2',
      status: 'Status2',
      reportedAt: 'DateTime1',
      ecu: 'ECU2',
      fmi: 'FMI2',
      count: 11,
      severity: {
        color: 'yellow',
        level: 2,
      },
    },
    {
      componentId: 'Component3',
      status: 'Status3',
      reportedAt: 'DateTime2',
      ecu: 'ECU2',
      fmi: 'FMI2',
      count: 11,
      severity: {
        color: 'yellow',
        level: 2,
      },
    },
  ]);
}

function buildCaseNotes() {
  return fromJS([
    {
      id: 1234,
      sender: {
        user: {
          id: 12346,
        },
        group: {
          id: -2,
        },
      },
      recipients: [
        {
          user: {
            id: 12345,
          },
          group: {
            id: -1,
          },
        },
      ],
      message: 'A note about something',
      sentAt: '2016-06-10T17:46:48Z',
      status: 'Read',
    },
  ]);
}

test('loadCaseSuccessWorker', async () => {
  const caseId = '123';
  const assetId = '456';
  const serviceProviderId = '789';
  const currentCase = buildCase(caseId, assetId, serviceProviderId);

  // This allows us to verify that our saga is reaching out to the network
  // without mocking the actual network.
  const response = {
    body: currentCase,
  };

  const sagaTester = new SagaTester({ initialState, reducers });
  sagaTester.start(sagas.loadCaseSuccessWatcher);
  sagaTester.dispatch({
    type: LOAD_CASE_SUCCESS,
    payload: response,
  });

  const appState = sagaTester.store.getState();

  expect(appState.getIn(['assets', 'responseIds'])).toEqual(OrderedSet());
  expect(appState.getIn(['assets', 'byId', assetId])).toEqual(Map({ id: assetId }));

  expect(appState.getIn(['cases', 'responseIds'])).toEqual(OrderedSet([caseId]));
  expect(appState.getIn(['cases', 'byId', caseId]))
    .toEqual(Map({ id: caseId, asset: assetId, serviceProvider: serviceProviderId }));
  expect(appState.getIn(['cases', 'currentCaseId'])).toEqual(caseId);

  expect(appState.getIn(['serviceProviders', 'responseIds'])).toEqual(OrderedSet());
  expect(appState.getIn(['serviceProviders', 'byId', serviceProviderId]))
    .toEqual(Map({ id: serviceProviderId }));
});

test('loadCaseFaultsSuccessWorker', async () => {
  const currentCaseFaults = buildCaseFaults();
  const response = {
    body: currentCaseFaults,
  };

  const sagaTester = new SagaTester({ initialState, reducers });
  sagaTester.start(sagas.loadCaseFaultsSuccessWatcher);
  sagaTester.dispatch({
    type: LOAD_CASE_FAULTS_SUCCESS,
    payload: response,
  });

  const appState = sagaTester.store.getState();

  expect(appState.getIn(['cases', 'currentCaseFaults'])).toEqual(currentCaseFaults);
});

test('loadCaseNotesSuccessWorker', async () => {
  const currentCaseNotes = buildCaseNotes();
  const response = {
    body: currentCaseNotes,
  };

  const sagaTester = new SagaTester({ initialState, reducers });
  sagaTester.start(sagas.loadCaseNotesSuccessWatcher);
  sagaTester.dispatch({
    type: LOAD_CASE_NOTES_SUCCESS,
    payload: response,
  });

  const appState = sagaTester.store.getState();

  expect(appState.getIn(['cases', 'currentCaseNotes'])).toEqual(currentCaseNotes);
});

test('loadCasesSuccessWorker', () => {
  const caseId1 = '123';
  const assetId1 = '456';
  const serviceProviderId1 = '789';
  const case1 = buildCase(caseId1, assetId1, serviceProviderId1);

  const caseId2 = 'abc';
  const assetId2 = 'def';
  const serviceProviderId2 = 'ghi';
  const case2 = buildCase(caseId2, assetId2, serviceProviderId2);

  const cases = [case1, case2];

  const response = {
    body: cases,
    headers: Map({ 'x-total-count': '2' }),
  };

  const sagaTester = new SagaTester({ initialState, reducers });
  sagaTester.start(sagas.loadCasesSuccessWatcher);
  sagaTester.dispatch({
    type: LOAD_CASES_SUCCESS,
    payload: response,
  });

  const appState = sagaTester.store.getState();
  expect(appState.getIn(['assets', 'responseIds'])).toEqual(OrderedSet());
  expect(appState.getIn(['assets', 'byId', assetId1])).toEqual(Map({ id: assetId1 }));
  expect(appState.getIn(['assets', 'byId', assetId2])).toEqual(Map({ id: assetId2 }));

  expect(appState.getIn(['cases', 'responseIds'])).toEqual(OrderedSet([caseId1, caseId2]));
  expect(appState.getIn(['cases', 'byId', caseId1]))
    .toEqual(Map({ id: caseId1, asset: assetId1, serviceProvider: serviceProviderId1 }));
  expect(appState.getIn(['cases', 'byId', caseId2]))
    .toEqual(Map({ id: caseId2, asset: assetId2, serviceProvider: serviceProviderId2 }));
  expect(appState.getIn(['cases', 'currentCaseId'])).toEqual('');
  expect(appState.getIn(['app', 'favoritePagination', 'totalCount'])).toEqual(2);

  expect(appState.getIn(['serviceProviders', 'responseIds'])).toEqual(OrderedSet());
  expect(appState.getIn(['serviceProviders', 'byId', serviceProviderId1]))
    .toEqual(Map({ id: serviceProviderId1 }));
  expect(appState.getIn(['serviceProviders', 'byId', serviceProviderId2]))
    .toEqual(Map({ id: serviceProviderId2 }));
});

test('postCaseNoteWorker', async () => {
  const caseId = '123';
  const params = {
    recipients: [
      {
        groupId: '123',
        userId: '234',
      },
      {
        groupId: '345',
        userId: '456',
      },
    ],
    message: 'message to test',
  };
  const payload = {
    caseId,
    params,
  };

  // This allows us to verify that our saga is reaching out to the network
  // without mocking the actual network.
  const response = '12345';
  const postCaseNoteSpy = spyOn(api, 'postCaseNote').andReturn({
    response: {
      body: response,
      headers: Map(),
      status: 201,
    },
  });

  // redux-saga-tester allows us to build our redux store with initial state,
  // and reducers. A few other options are also available.
  const sagaTester = new SagaTester({
    initialState,
    reducers,
    middlewares: [requestStatusMiddleware],
  });
  sagaTester.start(sagas.postCaseNoteWatcher);
  sagaTester.dispatch(actions.postCaseNote(payload));

  // redux-saga-tester can wait until a certain action's constant is called before progressing
  // with the test. In this case, saga re-loads the case again with LOAD_CASE_REQUEST action
  await sagaTester.waitFor(LOAD_CASE_REQUEST);

  // Verify that the network function was called with the correct params.
  expect(postCaseNoteSpy).toHaveBeenCalledWith(payload);
});

test('updateCaseWorker', async () => {
  const caseId = '123';
  const assetId = '456';
  const serviceProviderId = '789';
  const currentCase = buildCase(caseId, assetId, serviceProviderId);
  const payload = {
    caseId,
    approvalStatus: 'approved',
    comments: 'comments',
    poNumber: '222',
  };

  // This allows us to verify that our saga is reaching out to the network
  // without mocking the actual network.
  const response = currentCase;
  const updateCasespy = spyOn(api, 'updateCase').andReturn({
    response: {
      body: response,
      headers: Map(),
    },
  });

  // redux-saga-tester allows us to build our redux store with initial state,
  // and reducers. A few other options are also available.
  const sagaTester = new SagaTester({
    initialState,
    reducers,
    middlewares: [requestStatusMiddleware],
  });
  sagaTester.start(sagas.updateCaseWatcher);
  sagaTester.dispatch(actions.updateCaseRequest(payload));

  // redux-saga-tester can wait until a certain action's constant is called before progressing
  // with the test. In this case, SET_CURRENT_CASE is the last thing the saga does.
  await sagaTester.waitFor(UPDATE_CASE_REQUEST);

  // Verify that the network function was called with the correct params.
  expect(updateCasespy).toHaveBeenCalledWith(payload);
});
