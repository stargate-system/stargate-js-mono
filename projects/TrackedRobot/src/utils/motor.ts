// @ts-ignore
import {Gpio} from 'pigpio';

export class Motor {
    private readonly _pin1;
    private readonly _pin2;
    private setpoint = 0;
    private current = 0;
    private readonly minimum = 100;
    private readonly increment = 20;

    constructor(pin1: number, pin2: number) {
        this._pin1 = new Gpio(pin1, {mode: Gpio.OUTPUT});
        this._pin2 = new Gpio(pin2, {mode: Gpio.OUTPUT});
        setInterval(() => {
            if (this.setpoint !== this.current) {
                this.adjust();
            }
        }, 50);
    }

    run = (command: number) => {
        if (command === 0) {
            this.setpoint = 0;
        } else {
            const dir = command > 0 ? 1 : -1;
            this.setpoint = Math.round(dir * (Math.abs(command) * (255 - this.minimum) + this.minimum));
        }
    }

    stop = () => {
        this.setpoint = 0;
        this.current = 0;
        this._pin1.pwmWrite(0);
        this._pin2.pwmWrite(0);
    }

    private adjust = () => {
        const dir = (this.setpoint - this.current) > 0 ? 1 : -1;
        if (this.current === 0) {
            this.current = dir * this.minimum;
        } else {
            this.current += dir * this.increment;
        }
        if ((dir === -1 && this.current < this.setpoint) || (dir === 1 && this.current > this.setpoint)) {
            this.current = this.setpoint;
        }
        if (Math.abs(this.current) < this.minimum) {
            this.current = 0;
        }
        if (this.current === 0) {
            this._pin1.pwmWrite(0);
            this._pin2.pwmWrite(0);
        }
        else if (this.current > 0) {
            this._pin1.pwmWrite(this.current);
            this._pin2.pwmWrite(0);
        } else {
            this._pin1.pwmWrite(0);
            this._pin2.pwmWrite(-this.current);
        }
    }
}