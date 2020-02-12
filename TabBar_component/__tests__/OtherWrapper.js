import { test, expect } from '__tests__/helpers/test-setup';

import { borderLeft } from '../OtherWrapper';

test('border-left: none when there is no tab.', () => {
  const style = borderLeft({ hasTab: false });
  expect(style).toInclude('border-left: none');
});

test('excludes border-left when there is a tab.', () => {
  const style = borderLeft({ hasTab: true });
  expect(style).toEqual('');
});
