import React from 'react';
import PropTypes from 'prop-types';

import Wrapper from './Wrapper';
import TabWrapper from './TabWrapper';
import OtherWrapper from './OtherWrapper';
import NoTabsWrapper from './NoTabsWrapper';

function buildTabs(params) {
  const { tabs, emptyMessage, currentTab, onChangeTab } = params;
  if (tabs.length) {
    return tabs.map((tab, index) =>
      <TabWrapper
        key={tab.name}
        active={currentTab === tab.name || (index === 0 && !currentTab)}
        onClick={() => onChangeTab(tab.name)}
      >
        {tab.label}
      </TabWrapper>,
    );
  }
  return (
    <NoTabsWrapper>
      {emptyMessage}
    </NoTabsWrapper>
  );
}

function TabBar({ tabs, emptyMessage, currentTab, onChangeTab, children }) {
  return (
    <Wrapper>
      {buildTabs({ tabs, emptyMessage, currentTab, onChangeTab })}
      <OtherWrapper hasTab={tabs.length > 0}>
        {children}
      </OtherWrapper>
    </Wrapper>
  );
}

TabBar.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]),
    }),
  ),
  currentTab: PropTypes.string,
  onChangeTab: PropTypes.func.isRequired,
  children: PropTypes.node,
  emptyMessage: PropTypes.node,
};

TabBar.defaultProps = {
  tabs: [],
  currentTab: '',
  children: null,
  emptyMessage: null,
};

export default TabBar;
export TabBarOptionsWrapper from './TabBarOptionsWrapper';
