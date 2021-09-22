import {
  Modifier,
  Placement,
  Boundary,
  RootBoundary,
  Context,
  Padding
} from '@popperjs/core';

// TODO: import from @popperjs/core directly once this can be exported
type Options = {
  placement: Placement;
  boundary: Boundary;
  rootBoundary: RootBoundary;
  elementContext: Context;
  altBoundary: boolean;
  padding: Padding;
};

declare const maxSize: Modifier<'maxSize', Options>;

export default maxSize;
