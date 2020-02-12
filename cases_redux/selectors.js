import { List, Map } from 'immutable';
import { createSelector } from 'reselect';

import { assetStoreSelector } from 'redux/assets/selectors';
import { serviceProviderStoreSelector } from 'redux/serviceProviders/selectors';

// For convenience, extract the cases section of the store.
const casesStoreSelector = state => state.get('cases');

export const caseRequestingSelector = createSelector(
  casesStoreSelector,
  casesStore => casesStore.get('caseRequesting'),
);

export const caseFaultsRequestingSelector = createSelector(
  casesStoreSelector,
  casesStore => casesStore.get('caseFaultsRequesting'),
);

export const caseNotesRequestingSelector = createSelector(
  casesStoreSelector,
  casesStore => casesStore.get('caseNotesRequesting'),
);

export const casesRequestingSelector = createSelector(
  casesStoreSelector,
  casesStore => casesStore.get('requesting'),
);

export const casesErrorSelector = createSelector(
  casesStoreSelector,
  casesStore => casesStore.get('error'),
);

// When all of the cases are required we convert cases.byId into an immutable list.
export const casesSelector = createSelector(
  casesStoreSelector,
  casesStore => casesStore.get('responseIds').map(id => casesStore.getIn(['byId', id])).toList(),
);

// When just the current case is required, we retrieve the case data matching the current case id.
export const currentCaseSelector = createSelector(
  casesStoreSelector,
  casesStore => casesStore.getIn(['byId', casesStore.get('currentCaseId')]),
);

// When working with a current case, we will frequently want the related information. This is an
// example of how to select the asset attached to the current case.
export const currentCaseAssetSelector = createSelector(
  currentCaseSelector,
  assetStoreSelector,
  (currentCase, assetsStore) =>
    (currentCase && assetsStore.getIn(['byId', currentCase.get('asset')])) || Map(),
);

export const currentCaseFaultsSelector = createSelector(
  [casesStoreSelector],
  cases => cases.get('currentCaseFaults') || List(),
);

export const currentCaseNotesSelector = createSelector(
  [casesStoreSelector],
  cases => cases.get('currentCaseNotes'),
);

export const caseRecipientsSelector = createSelector(
  [casesStoreSelector],
  cases => cases.get('caseRecipients'),
);

// When working with a current case, we will frequently want the related information. This is an
// example of how to select the serviceProvider attached to the current case.
export const currentCaseServiceProviderSelector = createSelector(
  currentCaseSelector,
  serviceProviderStoreSelector,
  (currentCase, serviceProviderStore) =>
    (currentCase && serviceProviderStore.getIn(['byId', currentCase.get('serviceProvider')])) ||
    Map(),
);
