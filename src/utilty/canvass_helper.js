export const preventOutsideMovement = function (e) {
  var obj = e.target;
  // if object is too big ignore
  if (!obj || !obj.canvas) { return }
  if (
    obj.currentHeight > obj.canvas.height ||
    obj.currentWidth > obj.canvas.width
  ) {
    return;
  }
  obj.setCoords();
  // top-left  corner
  if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
    obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
    obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
  }
  // bot-right corner
  if (
    obj.getBoundingRect().top + obj.getBoundingRect().height >
    obj.canvas.height ||
    obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width
  ) {
    obj.top = Math.min(
      obj.top,
      obj.canvas.height -
      obj.getBoundingRect().height +
      obj.top -
      obj.getBoundingRect().top
    );
    obj.left = Math.min(
      obj.left,
      obj.canvas.width -
      obj.getBoundingRect().width +
      obj.left -
      obj.getBoundingRect().left
    );
  }
};

var left1 = 0;
var top1 = 0;
var scale1x = 0;
var scale1y = 0;
var width1 = 0;
var height1 = 0;
