export function getTransformSide(event: React.MouseEvent): string {
  const { clientX: x, clientY: y } = event;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const distances = {
    left: x,
    right: viewportWidth - x,
    top: y,
    bottom: viewportHeight - y,
  };

  const closestSide = Object.entries(distances).reduce(
    (min, [side, distance]) => (distance < min.distance ? { side, distance } : min),
    { side: 'left', distance: distances.left },
  ).side;

  return closestSide;
}
