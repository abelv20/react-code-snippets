import { test, expect } from '__tests__/helpers/test-setup';

import { activeStyle } from '../TabWrapper';

const theme = {
  colors: {
    base: {
      chrome200: 'inactiveBorder',
      background: 'activeBg',
    },
  },
};

test('style check when tab is active', () => {
  const style = activeStyle({ active: true, theme });
  expect(style).toInclude('background-color: activeBg');
  expect(style).toInclude('font-weight: bold');
});

test('style check when tab is inactive', () => {
  const style = activeStyle({ active: false, theme });
  expect(style).toInclude('background-color: transparent');
  expect(style).toInclude('border-bottom: 1px solid inactiveBorder');
});
