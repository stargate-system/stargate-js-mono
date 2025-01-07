// @ts-ignore
import {Gpio} from 'pigpio';

export interface ServoConfig {
    minPositon?: number,
    maxPosition?: number,
    mobility?: number,
    initialPosition?: number
}

export class Servo {
    minPositon = 500;
    maxPosition = 2500;
    mobility = 0.07;
    initialPosition = 0.5;
    private readonly _pin;
    private _position = 1500;
    private requestedPosition = 1500;
    private adjustmentTimeout: NodeJS.Timeout | undefined;

    constructor(pin: number, config?: ServoConfig) {
        if (config?.minPositon !== undefined) {
            this.minPositon = config.minPositon;
        }
        if (config?.maxPosition !== undefined) {
            this.maxPosition = config.maxPosition;
        }
        if (config?.mobility !== undefined) {
            this.mobility = config.mobility;
        }
        if (config?.initialPosition !== undefined) {
            this.initialPosition = config.initialPosition;
        }
        this._position = this.minPositon + Math.round(this.initialPosition * (this.maxPosition - this.minPositon));
        this._pin = new Gpio(pin, {mode: Gpio.OUTPUT});
        this._pin.servoWrite(this._position);
    }

    moveTo = (newPosition: number) => {
        this.requestedPosition = this.minPositon + Math.round(newPosition * (this.maxPosition - this.minPositon));
        if(this.adjustmentTimeout) {
            clearTimeout(this.adjustmentTimeout);
        }
        this.handlePosition();
    }

    get position() {
        return this._position;
    }

    private handlePosition = () => {
        this.adjustmentTimeout = undefined;
        let newPosition = Math.round(this.requestedPosition * this.mobility + this._position * (1 - this.mobility));
        if (newPosition < this.requestedPosition) {
            newPosition++;
        } else if (newPosition > this.requestedPosition) {
            newPosition--;
        }
        this._pin.servoWrite(newPosition);
        this._position = newPosition;
        if (this._position !== this.requestedPosition) {
            this.adjustmentTimeout = setTimeout(this.handlePosition, 10);
        }
    }
}