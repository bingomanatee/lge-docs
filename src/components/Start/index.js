import StartContainer from './StartContainer';
import extend from './extend';

const StartContainerHOC = extend(StartContainer);

export default StartContainerHOC

export {
  StartContainer,
  StartContainerHOC,
};
