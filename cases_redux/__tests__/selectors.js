import { fromJS } from 'immutable';

import {
  test,
  expect,
} from '__tests__/helpers/test-setup';

import * as selectors from '../selectors';

test('casesErrorSelector gets error from cases state', () => {
  const testState = fromJS({
    cases: {
      error: new Error('derp'),
    },
  });
  expect(selectors.casesErrorSelector(testState)).toEqual(testState.getIn(['cases', 'error']));
});

test('casesSelector returns the cases in the order specified by responseIds', () => {
  const testState = fromJS({
    cases: {
      responseIds: ['1', '2', '3'],
      byId: {
        3: { id: '3' },
        1: { id: '1' },
        2: { id: '2' },
      },
    },
  });
  expect(selectors.casesSelector(testState).toJS()).toEqual([
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]);
});

test('currentCaseSelector returns the data for the correct id', () => {
  const testState = fromJS({
    cases: {
      currentCaseId: '2',
      byId: {
        3: { id: '3' },
        1: { id: '1' },
        2: { id: '2' },
      },
    },
  });
  expect(selectors.currentCaseSelector(testState).toJS()).toEqual({ id: '2' });
});

test('currentCaseAssetSelector returns the data for the correct asset', () => {
  const testState = fromJS({
    assets: {
      byId: {
        a: { id: 'a' },
        b: { id: 'b' },
        c: { id: 'c' },
      },
    },
    cases: {
      currentCaseId: '2',
      byId: {
        3: { id: '3', asset: 'a' },
        1: { id: '1', asset: 'b' },
        2: { id: '2', asset: 'c' },
      },
    },
  });
  expect(selectors.currentCaseAssetSelector(testState).toJS()).toEqual({ id: 'c' });
});

test('currentCaseServiceProviderSelector returns the data for the correct service provider', () => {
  const testState = fromJS({
    serviceProviders: {
      byId: {
        a: { id: 'a' },
        b: { id: 'b' },
        c: { id: 'c' },
      },
    },
    cases: {
      currentCaseId: '2',
      byId: {
        3: { id: '3', serviceProvider: 'a' },
        1: { id: '1', serviceProvider: 'b' },
        2: { id: '2', serviceProvider: 'c' },
      },
    },
  });
  expect(selectors.currentCaseServiceProviderSelector(testState).toJS()).toEqual({ id: 'c' });
});
