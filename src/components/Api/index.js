import ApiContainer from './ApiContainer';
import extend from './extend';

const ApiContainerHOC = extend(ApiContainer);

export default ApiContainerHOC

export {
  ApiContainer,
  ApiContainerHOC,
};
