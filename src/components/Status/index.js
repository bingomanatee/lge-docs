import StatusContainer from './StatusContainer';
import extend from './extend';


const StatusContainerHOC = extend(StatusContainer);

export default StatusContainerHOC
export {
  StatusContainer,
  StatusContainerHOC,
};
