import PropTypes from 'prop-types';
import styled from 'styled-components';

import buildStyledComponent from 'utils/styles';

export function activeStyle({ active, theme }) {
  if (active) {
    return `
      background-color: ${theme.colors.base.background};
      font-weight: bold;
    `;
  }
  return `
    background-color: transparent;
    border-bottom: 1px solid ${theme.colors.base.chrome200};
  `;
}

/* istanbul ignore next */
const styles = props => `
  ${activeStyle(props)}
  align-items: center;
  border-left: 1px solid ${props.theme.colors.base.chrome200};
  border-top: 1px solid ${props.theme.colors.base.chrome200};
  cursor: pointer;
  display: flex;
  flex: 1;
  justify-content: center;
  max-width: ${props.theme.dimensions.tabWidth};

  &:hover {
    text-decoration: underline;
  }
`;

const themePropTypes = {
  colors: PropTypes.shape({
    base: PropTypes.shape({
      background: PropTypes.string.isRequired,
      chrome200: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  dimensions: PropTypes.shape({
    tabWidth: PropTypes.string.isRequired,
  }).isRequired,
};

const propTypes = {
  active: PropTypes.bool,
};

const defaultProps = {
  active: false,
};

export default buildStyledComponent(
  'TabWrapper',
  styled.div,
  styles,
  { defaultProps, propTypes, themePropTypes },
);
