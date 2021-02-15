import $ from "jquery";
import TimeUnit from "./TimeUnit";
import { TweenLite, Quad } from "gsap";

class Timer {
    constructor(tag) {
        this.main = $('main');
        this.main.removeClass('hide');

        this.bolsonaro = $('#bolsonaro');
        this.forbidden = $('#forbidden');
        this.counter = $('#counter');

        TweenLite.set([forbidden], { alpha: 0 });
        TweenLite.set([bolsonaro], { css: { opacity: 0, top: '1rem' } });
        TweenLite.set([counter], { css: { opacity: 0, top: '1rem' } });

        this.days = new TimeUnit($('.days'));
        this.hours = new TimeUnit($('.hours'));
        this.minutes = new TimeUnit($('.minutes'));
        this.seconds = new TimeUnit($('.seconds'));

        this._resize();
        $(window).resize(this._resize.bind(this));
        $(document).on("visibilitychange", this._visibilitychange.bind(this));

        this._getTime();
    }

    _visibilitychange() {
        if(this.timer){
            if (document.hidden) {
                console.log("Browser tab is hidden");
                this.timeStopped = Date.now();
            } else {
                console.log("Browser tab is visible");
                if (this.timeStopped) {
                    let delay = (Date.now() - this.timeStopped);
                    if(delay>60000) this._getTime();
                    this.timeStopped = 0;
                }
            }
        }        
    }

    _getTime() {
        console.log('Getting time');
        let self = this;
        let now = Date.now();
        $.ajax({
            url: "./gettime",
            type: 'post',
        }).done(function (data) {
            let dif = Date.now() - now;
            self.timeLeft = data.time + dif;
            if(!self.timer){
                //if(self.timeLeft>500) self.timeLeft -= 1000;
                self._updateUnits();
                self.startIntro();
            }            
        }).fail(function (jqXHR, textStatus, msg) {
            self._getTime();
        });
    }

    _resize() {
        this.windowWidth = $(window).outerWidth();
        this._updateFont();
    }

    _updateFont() {
        var fontSize = this.windowWidth * 0.0125;
        fontSize = this.windowWidth > 599 ? Math.max(this.windowWidth > 1024 ? 16 : this.windowWidth > 768 ? 28 : 22, fontSize) : this.windowWidth * .03505843;
        $("html").css("font-size", fontSize + 'px');
    }

    _loadResult() {
        let self = this;
        this._resultLoader = $.ajax({
            url: "./result",
            type: 'post',
        });
        this._resultLoader.done(function (msg) {
            $('body').append(msg)
            if(self.timeLeft<=0){
                showResult();
            }
        })
        this._resultLoader.fail(function (jqXHR, textStatus, msg) {
            self._loadResult();
        });
    }

    _updateUnits() {
        let daySeconds = 86400;
        let hourSeconds = 3600;
        let minuteSeconcs = 60;

        let totalTime = Math.round(this.timeLeft / 1000);
        //console.log(this.timeLeft);

        let days = Math.trunc(totalTime / daySeconds);
        totalTime -= (days * daySeconds);

        let hours = Math.trunc(totalTime / hourSeconds);
        totalTime -= (hours * hourSeconds);

        let minutes = Math.floor(totalTime / minuteSeconcs);
        totalTime -= (minutes * minuteSeconcs)

        let seconds = totalTime;

        this.days.value = days;
        this.hours.value = hours;
        this.minutes.value = minutes;
        this.seconds.value = seconds;
    }

    _updateTime() {        
        this.timeLeft -= 1000;
        this.timeLeft = Math.max(this.timeLeft,0);
        this._updateUnits();

        if (this.timeLeft <= 10000 && !this._resultLoader) {
            this._loadResult();
        }

        //console.log(this.days, this.hours, this.minutes, this.seconds,this.timeLeft);
        if (this.timeLeft <= 0) {
            clearInterval(this.timer);
            this.timer = null;
            if(window.showResult) showResult();            
        }
    }

    startIntro() {
        let self = this;        
        //this.timeLeft = 15000;
        TweenLite.to(this.bolsonaro, .75, { alpha: 1, top: 0, ease: Quad.easeInOut, delay: 0 });
        TweenLite.to(this.forbidden, .75, { alpha: 1, top: 0, ease: Quad.easeInOut, delay: 1 });
        TweenLite.to(this.counter, .75, {alpha: 1, top: 0, ease: Quad.easeInOut, delay: 1});
        self.startTimer();
    }

    startTimer() {
        this.timer = setInterval(this._updateTime.bind(this), 1000);
    }
}

window.timer = new Timer();