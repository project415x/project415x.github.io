// Is this file needed if we don't use the magic scrolling? -Cary
var controller = new ScrollMagic.Controller({
  globalSceneOptions: {
      triggerHook: "onLeave"
  }
});


var pinani = new TimelineMax()
    .add(TweenMax.to("#wipe0", 1.5, {transform: "translateY(0)"}))
    .add(TweenMax.to("#wipe1", 1.5, {transform: "translateY(0)"}))
    .add(TweenMax.to("#slide0", 1.5, {top: "0%", ease: Bounce.easeOut, delay: 0.2}))
    .add([
        TweenMax.to("#slide0 h1:first-child", 0.7, {autoAlpha: 0}),
        TweenMax.from("#slide0 h1:last-child", 0.7, {autoAlpha: 0})
    ])
    .add([
        TweenMax.to("#slide0", 0.8, {backgroundColor: "yellow"}),
        TweenMax.to("#slide0 h1:last-child", 0.8, {color: "blue"})
    ])
    .add([
        TweenMax.to("#slide0", 0.8, {backgroundColor: "green"}),
        TweenMax.to("#slide0 h1:last-child", 0.8, {color: "red"})
    ])
    .add([
        TweenMax.to("#slide0", 0.8, {backgroundColor: "red"}),
        TweenMax.to("#slide0 h1:last-child", 0.8, {color: "white"})
    ])
    .add([
        TweenMax.to("#slide0", 0.8, {backgroundColor: "#c7e1ff"}),
        TweenMax.to("#slide0 h1:last-child", 8, {color: "black"})
    ])
    .add(TweenMax.to("#slide1", 1.5, {transform: "translateX(0)"}))
    .add(TweenMax.to("#wipe2", 1.5, {transform: "translateY(0)"}))
    .add(TweenMax.to("#slide2", 1.5, {transform: "translateX(0)"}))
    .add(TweenMax.to("#wipe3", 1.5, {transform: "translateY(0)"}))
    .add(TweenMax.from("#unpin", 1, {top: "100%"}));

new ScrollMagic.Scene({
  triggerElement: "section#pin",
  duration: '100%'
})
.setTween(pinani)
.setPin("section#pin")
.addTo(controller);
