import React from 'react';
import { Map } from 'immutable';
import { noop } from 'lodash';

import {
  test,
  expect,
  actionAndSpy,
  mount,
  shallow,
  MountableTestComponent,
} from '__tests__/helpers/test-setup';

import * as casesActions from 'redux/cases/actions';
import * as appActions from 'redux/app/actions';

import Routes from 'setup/routes';
import dimensions from 'style/dimensions';

import CasePageMount, { CasePage } from '../index';

const assetId = '54321';
const caseId = '12345';

const defaultProps = {
  assetInfo: Map({ id: assetId }),
  caseInfo: Map({ id: caseId }),
  intl: {
    formatMessage: noop,
  },
  match: {
    params: {
      caseId,
    },
  },
  latestFavorite: {},
  loadCase: noop,
  loadCaseFaults: noop,
  loadCaseNotes: noop,
  setCurrentCase: noop,
  setCurrentCaseFaults: noop,
  setCurrentCaseNotes: noop,
  startLoading: noop,
};

function mountPage(initialEntries) {
  return mount(
    <MountableTestComponent authorized initialEntries={initialEntries} >
      <Routes />
    </MountableTestComponent>,
  );
}

function mountPageWithProps(props = defaultProps) {
  return mount(
    <MountableTestComponent authorized>
      <CasePageMount {...props} />
    </MountableTestComponent>,
  );
}

function shallowRender(props = defaultProps) {
  return shallow(<CasePage {...props} />);
}

test('Visiting the case route renders the correct component', () => {
  const caseRoute = `/cases/${caseId}`;
  const page = mountPage([caseRoute]);
  expect(page.find('CasePage').exists()).toBe(true);
});

test('Visiting the case route loads the case and starts global loading', () => {
  const loadCase = actionAndSpy(casesActions, 'loadCase');
  const startLoading = actionAndSpy(appActions, 'setLoadingStarted');
  mountPageWithProps();
  expect(loadCase).toHaveBeenCalledWith({ caseId });
  expect(startLoading).toHaveBeenCalled();
});

test('Leaving the case page clears the current state', () => {
  const setCurrentCase = actionAndSpy(casesActions, 'setCurrentCase');
  const page = mountPageWithProps();
  expect(setCurrentCase.calls.length).toEqual(1);
  page.unmount();
  expect(setCurrentCase.calls.length).toEqual(2);
});

test('Leaving the case page clears the current caseFaults state', () => {
  const setCurrentCaseFaults = actionAndSpy(casesActions, 'setCurrentCaseFaults');
  const page = mountPageWithProps();
  page.unmount();
  expect(setCurrentCaseFaults).toHaveBeenCalled();
});

test('loadCaseFaults is called when a previously stored case hasFaults', () => {
  const loadCaseFaults = actionAndSpy(casesActions, 'loadCaseFaults');
  mountPageWithProps({
    ...defaultProps,
    caseInfo: Map({ id: caseId, hasFaults: true }),
  });
  expect(loadCaseFaults).toHaveBeenCalled();
});

test('loadCaseFaults is called when a no case is stored', () => {
  const loadCaseFaults = actionAndSpy(casesActions, 'loadCaseFaults');
  mountPageWithProps({ ...defaultProps, caseInfo: Map() });
  expect(loadCaseFaults).toHaveBeenCalled();
});

test('Renders the correct component', () => {
  const component = shallowRender();
  expect(component).toContain('#case-page');
});

test('Renders a PageHeadingPanel', () => {
  const component = shallowRender();
  expect(component).toContain('PageHeadingPanel');
});

test('Renders a CaseOverview component with expected props', () => {
  const component = shallowRender();
  expect(component.find('CaseOverview').props()).toInclude({ caseInfo: defaultProps.caseInfo });
});


test('Renders a CaseOverview component with expected props', () => {
  const component = shallowRender();
  const header = component.find('PageHeadingPanel');
  expect(header).toContain('CaseOverview');
  expect(header.find('CaseOverview')).toHaveProps({
    assetInfo: defaultProps.assetInfo,
    caseInfo: defaultProps.caseInfo,
    latestFavorite: defaultProps.latestFavorite,
  });
});

test('Renders a CasePanel with expected props', () => {
  const component = shallowRender();
  expect(component).toContain('CasePanel');
  expect(component.find('CasePanel')).toHaveProps({
    assetInfo: defaultProps.assetInfo,
    caseInfo: defaultProps.caseInfo,
    serviceProviderInfo: defaultProps.serviceProviderInfo,
  });
});

test('collapse when windowWidth is less than autoCollapseLeftNavPx', () => {
  const component = shallowRender();
  const instance = component.instance();
  instance.setState({ collapsed: false });
  instance.onResizeWindow({ windowWidth: dimensions.autoCollapseLeftNavPx - 1 });
  expect(instance.state.collapsed).toEqual(true);
});

test('expand when windowWidth is less than autoCollapseLeftNavPx', () => {
  const component = shallowRender();
  const instance = component.instance();
  instance.setState({ collapsed: true });
  instance.onResizeWindow({ windowWidth: dimensions.autoCollapseLeftNavPx + 1 });
  expect(instance.state.collapsed).toEqual(false);
});
