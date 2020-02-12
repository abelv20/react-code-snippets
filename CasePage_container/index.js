import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

import ImmutablePropTypes from 'react-immutable-proptypes';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import {
  setLoadingStarted,
} from 'redux/app/actions';
import {
  latestFavoriteSelector,
} from 'redux/app/selectors';

import {
  loadCase,
  loadCaseFaults,
  loadCaseNotes,
  setCurrentCase,
  setCurrentCaseFaults,
  setCurrentCaseNotes,
} from 'redux/cases/actions';
import {
  currentCaseAssetSelector,
  currentCaseSelector,
  currentCaseServiceProviderSelector,
} from 'redux/cases/selectors';
import {
  actionBarItemClickedSelector,
} from 'redux/ui/selectors';

import QuickActionBar from 'containers/QuickActionBarContainer';

import CasePanel from 'components/CasePanel';
import CaseOverview from 'components/CasePanel/CaseOverview';
import WindowQuery from 'components/WindowQuery';

import Page from 'elements/Page';
import PageHeadingPanel from 'elements/PageHeadingPanel';

import dimensions from 'style/dimensions';

import messages from './messages';

export class CasePage extends Component {
  static propTypes = {
    actionBarItemClicked: ImmutablePropTypes.contains({
      buttonId: PropTypes.string,
      dropdownItemId: PropTypes.string,
    }),
    assetInfo: ImmutablePropTypes.map,
    caseInfo: ImmutablePropTypes.map,
    serviceProviderInfo: ImmutablePropTypes.map,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    latestFavorite: PropTypes.shape(),
    loadCase: PropTypes.func.isRequired,
    loadCaseFaults: PropTypes.func.isRequired,
    loadCaseNotes: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        caseId: PropTypes.string.isRequired,
      }),
    }).isRequired,
    setCurrentCase: PropTypes.func.isRequired,
    setCurrentCaseFaults: PropTypes.func.isRequired,
    setCurrentCaseNotes: PropTypes.func.isRequired,
    startLoading: PropTypes.func.isRequired,
  };

  static defaultProps = {
    actionBarItemClicked: Map({
      buttonId: '',
      dropdownItemId: '',
    }),
    assetInfo: Map(),
    caseInfo: Map(),
    latestFavorite: {},
    serviceProviderInfo: Map(),
  };

  state = {
    collapsed: true,
    // This state will be used to show the modal view when clicking "ADD NOTE" button
    showModal: false,
  };

  componentWillMount() {
    this.props.setCurrentCase(this.props.match.params.caseId);
  }

  componentDidMount() {
    const { match: { params: { caseId } }, caseInfo } = this.props;
    this.props.loadCase(caseId);
    if ((caseInfo && caseInfo.get('hasFaults')) || !caseInfo.get('id')) {
      this.props.loadCaseFaults(caseId);
    }
    if ((caseInfo && caseInfo.get('notesCount')) || !caseInfo.get('id')) {
      this.props.loadCaseNotes(caseId);
    }
    this.props.startLoading();
    this.updateCollapsedState(window.innerWidth);
  }

  componentWillReceiveProps({ actionBarItemClicked }) {
    const buttonId = actionBarItemClicked.get('buttonId');
    this.setState({
      showModal: buttonId !== 'options',
    });
  }

  componentWillUnmount() {
    this.props.setCurrentCase();
    this.props.setCurrentCaseFaults();
    this.props.setCurrentCaseNotes();
  }

  /**
   * event handler for resizing the window
   * @param  {number} windowWidth  The width of the window after resizing.
   * @return {null} This method is expected to mutate state, not return a value.
   */
  onResizeWindow = ({ windowWidth }) => {
    this.updateCollapsedState(windowWidth);
  }

  /**
   * Sets a new value for this.state.collapsed based on the current window width
   * @param  {number} windowWidth  The width of the window to be used in determining the collapsed
   * state
   * @return {null} This method is expected to mutate state, not return a value.
   */
  updateCollapsedState = (windowWidth) => {
    this.setState({ collapsed: windowWidth < dimensions.autoCollapseLeftNavPx });
  }

  render() {
    const {
      assetInfo,
      caseInfo,
      intl: { formatMessage },
      latestFavorite,
      serviceProviderInfo,
      actionBarItemClicked,
    } = this.props;
    const {
      collapsed,
    } = this.state;

    return (
      <WindowQuery onResize={this.onResizeWindow} >
        <Page id="case-page">
          <Helmet
            title={formatMessage(messages.title)}
            meta={[{ name: 'description', content: formatMessage(messages.description) }]}
          />
          <PageHeadingPanel>
            <CaseOverview
              assetInfo={assetInfo}
              caseInfo={caseInfo}
              collapsed={collapsed}
              latestFavorite={latestFavorite}
            />
          </PageHeadingPanel>
          <QuickActionBar pageTitle="CASE_PAGE" />
          <CasePanel
            assetInfo={assetInfo}
            caseInfo={caseInfo}
            serviceProviderInfo={serviceProviderInfo}
            actionBarItemClicked={actionBarItemClicked}
          />
        </Page>
      </WindowQuery>
    );
  }
}

function mapStateToProps(state) {
  return {
    actionBarItemClicked: actionBarItemClickedSelector(state),
    assetInfo: currentCaseAssetSelector(state),
    caseInfo: currentCaseSelector(state),
    latestFavorite: latestFavoriteSelector(state),
    serviceProviderInfo: currentCaseServiceProviderSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadCase: caseId => dispatch(loadCase({ caseId })),
    loadCaseFaults: caseId => dispatch(loadCaseFaults({ caseId })),
    loadCaseNotes: caseId => dispatch(loadCaseNotes({ caseId })),
    setCurrentCase: caseId => dispatch(setCurrentCase(caseId)),
    setCurrentCaseFaults: caseFaults => dispatch(setCurrentCaseFaults(caseFaults)),
    setCurrentCaseNotes: caseNotes => dispatch(setCurrentCaseNotes(caseNotes)),
    startLoading: () => dispatch(setLoadingStarted(true)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CasePage));
