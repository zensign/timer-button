Timer Button
==================

Hover, Tap/Click and Hold, or Loading Button Mechanism built on JavaScript and SVG.

Click/Tap and Hold Demo:
http://www.zen-sign.com/experiments/timer-button/timer.html

Loading Demo:
http://www.zen-sign.com/experiments/timer-button/loading.html

Simply created by including the javascript file in your HTML and instantiating the button and passing it a number of parameters.

Parameters:
+ elementId : The container element to which the button will be appended
+ interactionType : 'hover' or 'hold'
+ size : The size (in pixels) of the button (squared)
+ strokeWidth : Width of the stroke
+ strokeColor : Color of the stroke
+ centerColor : Color of the center
+ label : Initial button text
+ fontSize : size pf font
+ fontColor : color of the font
+ fontFamily : family of font
+ duration : Duration of timer
+ callback : Callback function when timer is complete

```javascript
var hoverTimerButton = new HoverTimerButton('some-element-id',
                                            'hold',
                                            300, 
                                            20, 
                                            'rgba(255,255,255,.8)', 
                                            'rgba(255,255,255,.8)', 
                                            'Start Mission', 
                                            34, 
                                            'black', 
                                            'Roboto', 
                                            3000, 
                                            playOutro ).init();
```
