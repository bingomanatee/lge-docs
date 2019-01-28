import IntroContainer from './IntroContainer';
import extend from './extend';

const IntroContainerHOC = extend(IntroContainer);

export default IntroContainerHOC

export {
  IntroContainer,
  IntroContainerHOC,
};
