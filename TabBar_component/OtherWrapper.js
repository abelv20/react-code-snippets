import PropTypes from 'prop-types';
import styled from 'styled-components';

import px2rem from 'utils/px2rem';
import buildStyledComponent from 'utils/styles';

export function borderLeft({ hasTab }) {
  if (hasTab) {
    return '';
  }
  return `
    border-left: none;
  `;
}

/* istanbul ignore next */
const styles = props => `
  align-items: center;
  border: 1px solid ${props.theme.colors.base.chrome200};
  ${borderLeft(props)}
  display: flex;
  flex: 1;
  padding-left: ${px2rem(7)};
  padding-right: ${px2rem(7)};
`;

const themePropTypes = {
  colors: PropTypes.shape({
    base: PropTypes.shape({
      chrome200: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const propTypes = {
  hasTab: PropTypes.bool,
};

const defaultProps = {
  hasTab: true,
};

export default buildStyledComponent(
  'OtherWrapper',
  styled.div,
  styles,
  { defaultProps, propTypes, themePropTypes },
);
