import _ from 'lodash';
import AI from '../src/ai.js';

describe('AI.pickPosition()', () => {
  it('returns a random posistion from avaiable positins', () => {
    const all = _.range(100);
    const alreadyShotPositions = _.sampleSize(all, 20);
    const avaiablePositions = _.difference(all, alreadyShotPositions);
    const pickedPosition = AI.pickPosition(alreadyShotPositions);

    expect(avaiablePositions).toContain(pickedPosition);
    expect(alreadyShotPositions).not.toContain(pickedPosition);
  });
});
