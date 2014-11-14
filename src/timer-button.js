/*******************

    Class: TimerButton
    Description: Creates a new Timer Button
        Parameters:
        + elementId : The container element to which the button will be appended
        + interactionType : 'hover', 'hold' or 'load'
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

*******************/

function TimerButton(elementId, interactionType, size, strokeWidth, strokeColor, centerColor, label, fontSize, fontColor, fontFamily, duration, callback)
{
    this.interactionType = interactionType,
    this.elementId = elementId;
    this.size = size,
    this.center = size*.5,
    this.radius = size*.5,
    this.strokeWidth = strokeWidth,
    this.strokeColor = strokeColor,
    this.centerColor = centerColor,
    this.label = label,
    this.fontSize = fontSize,
    this.fontColor = fontColor,
    this.fontFamily = fontFamily,
    this.duration = duration,
    this.time = 0,
    this.now = null,
    this.then = null,
    this.intervalDelay = 10,
    this.callback = callback,
    this.progress = 0,
    this.timer = null,
    this.isRunning = false,

    this.init = function()
    {
        var self = this;
        var container = document.getElementById(this.elementId);
        var styles = 'width: '+this.size+'px; height: '+this.size+'px; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none; outline: none;';
        container.setAttribute('style', styles);

        container.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="'+this.size+'" height="'+this.size+'"><defs><mask id="timer-button-circle-cutout"><rect width="100%" height="100%" fill="white"/><circle r="'+(this.radius-this.strokeWidth)+'" cx="'+this.center+'" cy="'+this.center+'" /></mask></defs><path id="timer-button-pie" d="" fill="'+this.strokeColor+'" mask="url(\'#timer-button-circle-cutout\')" /><circle r="'+(this.radius-(this.strokeWidth*1.25))+'" cx="'+this.center+'" cy="'+this.center+'" fill="'+this.centerColor+'" /><text x="'+this.center+'" y="'+(this.center+(this.fontSize*.5))+'" font-family="'+this.fontFamily+'" font-size="'+this.fontSize+'" fill="'+this.fontColor+'" font-weight="bold" text-anchor="middle" id="timer-button-label">'+label+'</text></svg>';

        container.onselectstart = function(){ return false; };

        if(this.interactionType == 'hover')
        {
            this.addEvent(container, 'mouseover', function(e)
            {
                if(self.isWithinElement(e, container)) self.startTimer();
            });

            this.addEvent(container, 'mouseout', function(e)
            {
                if(!self.isWithinElement(e, container)) self.stopTimer();
            });
        }
        else if(this.interactionType == 'hold')
        {
            if("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch)
            {
                this.addEvent(container, 'touchstart', function(e)
                {
                    self.startTimer();
                });

                this.addEvent(window, 'touchend', function(e)
                {
                    self.stopTimer();
                });
            }
            else
            {
                this.addEvent(container, 'mousedown', function(e)
                {
                    self.startTimer();
                });

                this.addEvent(window, 'mouseup', function(e)
                {
                    self.stopTimer();
                });
            }
        }
    },

    this.drawPie = function(startdegrees, enddegrees)
    {
        var radian = 0.0174532925;
        var startangle = startdegrees * radian;
        var endangle = enddegrees * radian;
        var x1 = this.center + this.radius * Math.sin(startangle);
        var y1 = this.center - this.radius * Math.cos(startangle);
        var x2 = this.center + this.radius * Math.sin(endangle);
        var y2 = this.center - this.radius * Math.cos(endangle);
        var big = 0;

        if (endangle - startangle > Math.PI) big = 1;
        
        var d = "M " + this.center + "," + this.center +
            " L " + x1 + "," + y1 +
            " A " + this.radius + "," + this.radius +
            " 0 " + big + " 1 " +
            x2 + "," + y2 +
            " Z";
        
        document.getElementById(this.elementId).childNodes[0].childNodes[1].setAttribute('d',d);
    },

    this.startTimer = function()
    {
        if(this.isRunning) return;

        var self = this;
        this.isRunning = true;
        this.now = Date.now();
        this.then = Date.now();

        if(!window.requestAnimationFrame)
        {
            this.timer = window.setInterval(function(){ self.stepTimer(); }, this.intervalDelay);
        }
        else
        {
            this.timer = window.requestAnimationFrame(function(){ self.stepTimer(); });
        }
    },

    this.stopTimer = function()
    {
        if(!this.isRunning) return;

        if(!window.requestAnimationFrame)
        {
            clearInterval(this.timer);
        }
        else
        {
            window.cancelAnimationFrame(this.timer);
        }

        this.setProgress(0);
        this.isRunning = false;
        this.time = 0;
        this.resetDisplay();
    },

    this.stepTimer = function()
    {
        this.now = Date.now();
        var delta = (this.now - this.then);
        this.then = this.now;
        
        var self = this;
        this.time += delta;
        var step = this.time / this.duration;

        this.setProgress(step*100);
        this.updateDisplay();

        if(this.progress >= 100)
        {
            if(!window.requestAnimationFrame)
            {
                clearInterval(this.timer);
            }
            else
            {
                window.cancelAnimationFrame(this.timer);
            }
            
            this.isRunning = false;
            this.callback();
            this.time = 0;
        }
        else
        {
            if(window.requestAnimationFrame) this.timer = window.requestAnimationFrame(function(){ self.stepTimer(); });
        }
    },

    this.setProgress = function(progress)
    {
        this.progress = Math.max(0, Math.min(100, progress));
    },

    this.getProgress = function()
    {
        return this.progress;
    },

    this.updateDisplay = function()
    {
        this.drawPie(0, (this.progress*.01) * 359.999);
    },

    this.resetDisplay = function()
    {
        document.getElementById(this.elementId).childNodes[0].childNodes[1].setAttribute('d','');

        document.getElementById(this.elementId).childNodes[0].childNodes[3].textContent = this.label;
    },

    this.loadingUpdate = function(loaded)
    {
        document.getElementById(this.elementId).childNodes[0].childNodes[3].textContent = String(Math.round(loaded*100))+'%';

        this.setProgress(loaded*100);
        this.updateDisplay();
    },

    this.addEvent = function( obj, type, fn )
    {
        if ( obj.attachEvent )
        {
            obj['e'+type+fn] = fn;
            obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
            obj.attachEvent( 'on'+type, obj[type+fn] );
        } else
            obj.addEventListener( type, fn, false );
    },

    this.removeEvent = function( obj, type, fn )
    {
        if ( obj.detachEvent )
        {
            obj.detachEvent( 'on'+type, obj[type+fn] );
            obj[type+fn] = null;
        } else
            obj.removeEventListener( type, fn, false );
    },

    this.isWithinElement = function(e, element)
    {
        var clientRects = element.getClientRects();
        clientRects = clientRects[0];

        var relativeX = e.pageX - clientRects.left;
        var relativeY = e.pageY - clientRects.top;

        return (relativeX > 0 && relativeX < clientRects.width && relativeY > 0 && relativeY < clientRects.height);
    },

    this.init()
}