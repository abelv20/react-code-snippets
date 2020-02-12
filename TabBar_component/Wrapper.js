import PropTypes from 'prop-types';
import styled from 'styled-components';

import px2rem from 'utils/px2rem';
import buildStyledComponent from 'utils/styles';

/* istanbul ignore next */
const styles = props => `
  background-color: ${props.theme.colors.base.chrome100};
  color: ${props.theme.colors.base.textLight};
  display: flex;
  flex-grow: 1;
  font-size: ${px2rem(12)};
  height: ${px2rem(34)};
`;

const themePropTypes = {
  colors: PropTypes.shape({
    base: PropTypes.shape({
      chrome100: PropTypes.string.isRequired,
      textLight: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default buildStyledComponent(
  'Wrapper',
  styled.section,
  styles,
  { themePropTypes },
);
