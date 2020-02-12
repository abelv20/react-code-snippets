import React from 'react';
import { test, expect, shallow } from '__tests__/helpers/test-setup';

import TabBar from '../index';

const defaultTabs = [
  { name: 'tab1', label: 'Tab1' },
  { name: 'tab2', label: 'Tab2' },
  { name: 'tab3', label: 'Tab3' },
];

const defaultHandler = expect.createSpy();

const defaultChildren = <div>Children</div>;
const defaultEmptyMessage = <div>Empty Message</div>;

function buildTabBar(
  tabs = defaultTabs,
  currentTab = defaultTabs[0].name,
  onChangeTab = defaultHandler,
  children = defaultChildren,
  emptyMessage = defaultEmptyMessage,
) {
  return shallow(
    <TabBar
      tabs={tabs}
      currentTab={currentTab}
      onChangeTab={onChangeTab}
      emptyMessage={emptyMessage}
    >
      {children}
    </TabBar>,
  );
}

test('Renders Wrapper', () => {
  expect(buildTabBar()).toBeA('Wrapper');
});

test('Renders OtherWrapper', () => {
  expect(buildTabBar()).toContain('OtherWrapper');
});

test('Renders OtherWrapper', () => {
  expect(buildTabBar().find('TabWrapper').length).toEqual(defaultTabs.length);
});

test('Renders OtherWrapper', () => {
  const otherWrapper = buildTabBar().find('OtherWrapper');
  expect(otherWrapper.contains(defaultChildren)).toEqual(true);
});

test('Renders NoTabsWrapper when there is no tab', () => {
  expect(buildTabBar([])).toContain('NoTabsWrapper');
  expect(buildTabBar([]).contains(defaultEmptyMessage))
    .toEqual(true);
});

test('Does not render NoTabsWrapper when there is tab', () => {
  expect(buildTabBar()).toNotContain('NoTabsWrapper');
});

test('TabWrapper is active when it is a current tab', () => {
  const tabWrapper = buildTabBar(defaultTabs, defaultTabs[1].name).find('TabWrapper').at(1);
  expect(tabWrapper).toHaveProp('active', true);
});

test('onChangeTab called when one of tabs is clicked', () => {
  const component = buildTabBar();
  const index = 1;
  const secondTab = component.find('TabWrapper').at(index);
  secondTab.simulate('click');
  expect(defaultHandler).toHaveBeenCalledWith(defaultTabs[index].name);
});
