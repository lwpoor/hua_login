const slider = {

}

slider.slider = function () {
  var dragContainer = document.getElementById("dragContainer");
  var dragBg = document.getElementById("dragBg");
  var dragText = document.getElementById("dragText");
  var dragHandler = document.getElementById("dragHandler");
  var orgpos = document.getElementById("dragHandler").offsetLeft;
  //滑块最大偏移量
  var maxHandlerOffset = dragContainer.clientWidth - dragHandler.clientWidth;
  initDrag();

  function initDrag() {
    dragText.textContent = "拖动滑块验证";
    dragHandler.addEventListener("mousedown", onDragHandlerMouseDown);

    dragHandler.addEventListener("touchstart", onDragHandlerTouchStart);
  }

  function onDragHandlerMouseDown() {
    document.addEventListener("mousemove", onDragHandlerMouseMove);
    document.addEventListener("mouseup", onDragHandlerMouseUp);
  }


  function onDragHandlerMouseMove(event) {
    /*
    html元素不存在width属性,只有clientWidth
    offsetX是相对当前元素的,clientX和pageX是相对其父元素的
    */
    event = event ? event : window.event;
    var left = (event.clientX - orgpos);
    if (left < 0) {
      left = 0;
    } else if (left > maxHandlerOffset) {
      left = maxHandlerOffset;
      verifySucc();
    }
    dragHandler.style.left = left + "px";
    dragBg.style.width = dragHandler.style.left;
  }
  function onDragHandlerMouseUp() {
    document.removeEventListener("mousemove", onDragHandlerMouseMove);
    document.removeEventListener("mouseup", onDragHandlerMouseUp);
    dragHandler.style.left = 0;
    dragBg.style.width = 0;
  }

  //验证成功
  function verifySucc() {
    dragText.textContent = "验证通过";
    dragText.style.color = "white";
    dragHandler.setAttribute("class", "dragHandlerOkBg");
    dragHandler.removeEventListener("mousedown", onDragHandlerMouseDown);
    document.removeEventListener("mousemove", onDragHandlerMouseMove);
    document.removeEventListener("mouseup", onDragHandlerMouseUp);

    dragHandler.removeEventListener("touchstart", onDragHandlerTouchStart);
    document.removeEventListener("touchmove", onDragHandlerTouchMove);
    document.removeEventListener("touchend", onDragHandlerTouchEnd);
  };

  function onDragHandlerTouchStart() {
    var event = event || window.event;

    switch (event.type) {
      case "touchstart":
        document.addEventListener("touchmove", onDragHandlerTouchMove);
        document.addEventListener("touchend", onDragHandlerTouchEnd);
        break;
    }

  }
  function onDragHandlerTouchMove(event) {
    var event = event || window.event;

    switch (event.type) {
      case "touchmove":
        event = window.event;
        var left = (event.touches[0].clientX - orgpos);
        if (left < 0) {
          left = 0;
        } else if (left > maxHandlerOffset) {
          left = maxHandlerOffset;
          verifySucc();
        }
        dragHandler.style.left = left + "px";
        dragBg.style.width = dragHandler.style.left;
        break;
    }

  }
  function onDragHandlerTouchEnd() {
    var event = event || window.event;

    switch (event.type) {
      case "touchend":
        document.removeEventListener("touchmove", onDragHandlerTouchMove);
        document.removeEventListener("touchend", onDragHandlerTouchEnd);
        dragHandler.style.left = 0;
        dragBg.style.width = 0;
        break;
    }

  }
}

export default slider;
