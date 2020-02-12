import endpoints from 'apiEndpoints';
import {
  get,
  patch,
  post,
} from 'utils/fetch';

export function getCase({ caseId }) {
  return get(endpoints.case({ caseId }));
}

export function getCases(queryParams) {
  return get(endpoints.cases(), queryParams);
}

export function getCaseFaults({ caseId }) {
  return get(endpoints.caseFaults({ caseId }));
}

export function getCaseNotes({ caseId }) {
  return get(endpoints.caseNotes({ caseId }));
}

export function getCaseRecipients({ caseId }) {
  return get(endpoints.caseRecipients({ caseId }));
}

export function postCaseNote({ caseId, params }) {
  return post(endpoints.caseNotes({ caseId }), { requestBody: params });
}

export function updateCase({ caseId, versionId, approvalStatus, comments, poNumber }) {
  return patch(
    endpoints.caseVersion({ caseId, versionId }),
    { requestBody: { approvalStatus, comments, poNumber } },
  );
}

export function updateCaseNote({ caseId, noteId, status }) {
  return patch(endpoints.caseNote({ caseId, noteId }), { requestBody: { status } });
}
