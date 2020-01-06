const Ship = (positions) => {
  const { length } = positions;
  const hits = [];
  const hit = (position) => {
    if (!positions.includes(position) || hits.includes(position)) {
      return false;
    }
    hits.push(position);

    return hits;
  };
  const isSunk = () => hits.length === length;

  return {
    positions,
    length,
    hits,
    hit,
    isSunk,
  };
};

export default Ship;
