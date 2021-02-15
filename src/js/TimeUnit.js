import $ from "jquery";
import { TweenLite, Quad } from "gsap";

export default class TimeUnit {
    constructor(tag) {
        this.card = tag.find('>div');
        this.tag = this.card.find('span');
        this.updateSize();
    }

    updateSize(){
        this.tag.css({ width: `${Math.pow(this.tag.html().length * 8, 1 / 1.95)}rem` });
    }

    get value() {
        return this._value;
    }

    set value(val) {
        let self = this;
        let lastValue = this.tag.html();

        this._value = val;
        val += "";
        val = val.length < 2 ? ("00" + val).substr(-2) : val;

        if(document.hidden) return;

        this.updateSize();
        this.tag.html(val);
        
        if (val != lastValue && !this.card.find('.clone')[0]) {
            let clone = $(`<div class="clone">
            <div class="half">
                <div class="crop front">
                    <span>${lastValue}<span class="shadow"></span></span>
                </div>
                <div class="crop back">
                    <span>${val}<span class="shadow"></span></span>
                </div>
            </div>
            <div class="half crop"><span>${lastValue}</span></div>
        </div>`);
            let timeScale = 1;
            let time = .2*timeScale;
            let shadowTime = time * .3;
            let half = clone.find('.half').eq(0);
            let front = clone.find('.front span');
            let back = clone.find('.back span');
            this.card.append(clone);
            TweenLite.to(front.find('.shadow'), shadowTime, { alpha: 0.2, ease: Quad.easeIn, onComplete:function(){
                self.updateSize();
            } });
            TweenLite.set(back.find('.shadow'), { alpha: .05 });
            TweenLite.to(back.find('.shadow'), shadowTime, { alpha: 0, ease: Quad.easeOut, delay: time-shadowTime });
            TweenLite.to(half, time, {
                rotateX: -179, ease: Quad.easeInOut, onComplete: function () {
                    clone.remove();                    
                }
            });
        }
    }
}