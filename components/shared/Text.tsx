import { Theme } from '../../theme';
import { createText } from '@shopify/restyle';

const Text = createText<Theme>();

Text.defaultProps = {
    variant: 'body',
    color: 'mainText'
}

export default Text;