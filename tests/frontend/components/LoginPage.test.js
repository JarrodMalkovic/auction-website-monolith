import React from 'react';
import { create } from 'react-test-renderer';

import BidItem from '../../../my-app/src/components/Bids/BidItem';

describe('Button component', () => {
  it('renders correctly when there are no items', () => {
    const bidItem = create(<BidItem />).toJSON();
    expect(bidItem).toMatchSnapshot();
  });
});
