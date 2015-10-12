var controller = new ScrollMagic.Controller({
  globalSceneOptions: {
      triggerHook: "onLeave"
  }
});


var pinani = new TimelineMax()
    .add(TweenMax.to("#wipe", 1.5, {transform: "translateY(0)"}))
    .add(TweenMax.to("#second-wipe", 1.5, {transform: "translateY(0)"}))
    .add(TweenMax.to("#slide", 1.5, {top: "0%", ease: Bounce.easeOut, delay: 0.2}))
    .add([
        TweenMax.to("#slide h1:first-child", 0.7, {autoAlpha: 0}),
        TweenMax.from("#slide h1:last-child", 0.7, {autoAlpha: 0})
    ])
    .add([
        TweenMax.to("#slide", 0.8, {backgroundColor: "yellow"}),
        TweenMax.to("#slide h1:last-child", 0.8, {color: "blue"})
    ])
    .add([
        TweenMax.to("#slide", 0.8, {backgroundColor: "green"}),
        TweenMax.to("#slide h1:last-child", 0.8, {color: "red"})
    ])
    .add([
        TweenMax.to("#slide", 0.8, {backgroundColor: "red"}),
        TweenMax.to("#slide h1:last-child", 0.8, {color: "white"})
    ])
    .add([
        TweenMax.to("#slide", 0.8, {backgroundColor: "#c7e1ff"}),
        TweenMax.to("#slide h1:last-child", 8, {color: "black"})
    ])
    .add(TweenMax.to("#slide-uno", 1.5, {transform: "translateX(0)"}))
    .add(TweenMax.to("#third-wipe", 1.5, {transform: "translateY(0)"}))
    .add(TweenMax.to("#slide-dos", 1.5, {transform: "translateX(0)"}))
    .add(TweenMax.to("#fourth-wipe", 1.5, {transform: "translateY(0)"}))
    .add(TweenMax.from("#unpin", 1, {top: "100%"}));

new ScrollMagic.Scene({
  triggerElement: "section#pin",
  duration: '100%'
})
.setTween(pinani)
.setPin("section#pin")
.addTo(controller);
