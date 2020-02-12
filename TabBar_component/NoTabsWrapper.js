import PropTypes from 'prop-types';
import styled from 'styled-components';

import px2rem from 'utils/px2rem';
import buildStyledComponent from 'utils/styles';

/* istanbul ignore next */
const styles = props => `
  border: 1px solid ${props.theme.colors.base.chrome200};
  border-right: none;
  font-style: italic;
  line-height: ${px2rem(34)};
  padding-left: ${px2rem(10)};
`;

const themePropTypes = {
  colors: PropTypes.shape({
    base: PropTypes.shape({
      chrome200: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default buildStyledComponent(
  'NoTabsWrapper',
  styled.div,
  styles,
  { themePropTypes },
);
