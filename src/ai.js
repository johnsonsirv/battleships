import _ from 'lodash';

const AI = (() => {
  const allPositions = _.range(100);

  const pickPosition = (alreadyShot) => {
    const availablePositions = _.difference(allPositions, alreadyShot);
    return _.sample(availablePositions);
  };

  return {
    pickPosition,
  };
})();

export default AI;