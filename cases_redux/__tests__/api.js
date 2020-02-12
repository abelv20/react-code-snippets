import nock from 'nock';
import { test, expect } from '__tests__/helpers/test-setup';

import * as api from '../api';

const testDomain = process.env.API_BASE_URL;

test('getCase reaches the expected route and returns the response', async () => {
  const caseId = '12345';
  const response = { response: 'success' };
  const httpMock = nock(testDomain);
  httpMock.get(`/cases/${caseId}?`).reply(200, response);

  const { response: httpResponse } = await api.getCase({ caseId });

  expect(httpMock.isDone()).toBe(true);
  expect(httpResponse.body).toEqual(response);
});

test('getCases reaches the expected route and returns the response', async () => {
  const scope = 'test-scope';
  const perPage = 42;
  const response = [{ response: 'success' }];
  const httpMock = nock(testDomain);
  httpMock.get('/cases')
    .query({
      scope,
      per_page: perPage,
    })
    .reply(200, response);

  const { response: httpResponse } = await api.getCases({ scope, per_page: perPage });

  expect(httpMock.isDone()).toBe(true);
  expect(httpResponse.body).toEqual(response);
});

test('getCaseFaults reaches the expected route and returns the response', async () => {
  const caseId = '12345';
  const response = [{ response: 'success' }];
  const httpMock = nock(testDomain);
  httpMock.get(`/cases/${caseId}/faults?`).reply(200, response);

  const { response: httpResponse } = await api.getCaseFaults({ caseId });

  expect(httpMock.isDone()).toBe(true);
  expect(httpResponse.body).toEqual(response);
});

test('getCaseNotes reaches the expected route and returns the response', async () => {
  const caseId = '12345';
  const response = [{ response: 'success' }];
  const httpMock = nock(testDomain);
  httpMock.get(`/cases/${caseId}/notes?`).reply(200, response);

  const { response: httpResponse } = await api.getCaseNotes({ caseId });

  expect(httpMock.isDone()).toBe(true);
  expect(httpResponse.body).toEqual(response);
});

test('getCaseRecipients reaches the expected route and returns the response', async () => {
  const caseId = '12345';
  const response = [{ response: 'success' }];
  const httpMock = nock(testDomain);
  httpMock.get(`/cases/${caseId}/recipients?`).reply(200, response);

  const { response: httpResponse } = await api.getCaseRecipients({ caseId });

  expect(httpMock.isDone()).toBe(true);
  expect(httpResponse.body).toEqual(response);
});

test('postCaseNote reaches the expected route and returns the response', async () => {
  const caseId = '12345';
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
    message: 'test api message',
  };
  const response = {};
  const httpMock = nock(testDomain);

  httpMock.post(`/cases/${caseId}/notes?`).reply(201, response);

  const { response: httpResponse } = await api.postCaseNote({ caseId }, params);

  expect(httpMock.isDone()).toBe(true);
  expect(httpResponse.status).toEqual(201);
});

test('updateCase reaches the expected route and returns the response', async () => {
  const caseId = '12345';
  const versionId = '1';
  const response = { status: 'success' };
  const httpMock = nock(testDomain);

  httpMock.patch(`/cases/${caseId}/versions/${versionId}?`).reply(200, response);

  const { response: httpResponse } = await api.updateCase({ caseId, versionId });

  expect(httpMock.isDone()).toBe(true);
  expect(httpResponse.body).toEqual(response);
});

test('updateCaseNote reaches the expected route and returns the response', async () => {
  const caseId = '12345';
  const noteId = '22222';
  const status = 'read';
  const response = { status: 'success' };
  const httpMock = nock(testDomain);

  httpMock.patch(`/cases/${caseId}/notes/${noteId}?`).reply(200, response);

  const { response: httpResponse } = await api.updateCaseNote({ caseId, noteId, status });

  expect(httpMock.isDone()).toBe(true);
  expect(httpResponse.body).toEqual(response);
});
