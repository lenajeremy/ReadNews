import { Theme } from '../../theme';
import { createText } from '@shopify/restyle';

const Text = createText<Theme>();

Text.defaultProps = {
    fontFamily: 'Inter-Regular',
    variant: 'body',
    color: 'mainText'
}

export default Text;