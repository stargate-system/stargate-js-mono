"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servo = void 0;
// @ts-ignore
const pigpio_1 = require("pigpio");
class Servo {
    constructor(pin, config) {
        this.minPositon = 500;
        this.maxPosition = 2500;
        this.mobility = 0.07;
        this.initialPosition = 0.5;
        this._position = 1500;
        this.requestedPosition = 1500;
        this.moveTo = (newPosition) => {
            this.requestedPosition = this.minPositon + Math.round(newPosition * (this.maxPosition - this.minPositon));
            if (this.adjustmentTimeout) {
                clearTimeout(this.adjustmentTimeout);
            }
            this.handlePosition();
        };
        this.handlePosition = () => {
            this.adjustmentTimeout = undefined;
            let newPosition = Math.round(this.requestedPosition * this.mobility + this._position * (1 - this.mobility));
            if (newPosition < this.requestedPosition) {
                newPosition++;
            }
            else if (newPosition > this.requestedPosition) {
                newPosition--;
            }
            this._pin.servoWrite(newPosition);
            this._position = newPosition;
            if (this._position !== this.requestedPosition) {
                this.adjustmentTimeout = setTimeout(this.handlePosition, 10);
            }
        };
        if ((config === null || config === void 0 ? void 0 : config.minPositon) !== undefined) {
            this.minPositon = config.minPositon;
        }
        if ((config === null || config === void 0 ? void 0 : config.maxPosition) !== undefined) {
            this.maxPosition = config.maxPosition;
        }
        if ((config === null || config === void 0 ? void 0 : config.mobility) !== undefined) {
            this.mobility = config.mobility;
        }
        if ((config === null || config === void 0 ? void 0 : config.initialPosition) !== undefined) {
            this.initialPosition = config.initialPosition;
        }
        this._position = this.minPositon + Math.round(this.initialPosition * (this.maxPosition - this.minPositon));
        this._pin = new pigpio_1.Gpio(pin, { mode: pigpio_1.Gpio.OUTPUT });
        this._pin.servoWrite(this._position);
    }
    get position() {
        return this._position;
    }
}
exports.Servo = Servo;
