import {GateValue} from "../components/values/components/GateValue.js";
import {Directions} from "../components/values/constants/Directions.js";
import {GateBoolean} from "../components/values/components/GateBoolean.js";
import {GateString} from "../components/values/components/GateString.js";
import {GateNumber} from "../components/values/components/GateNumber.js";
import {ValueTypes} from "../components/values/constants/ValueTypes.js";

export class ConfigurableValueFactory {
    private readonly _initializeValueFunction: (value: GateValue<any>) => void;
    private readonly _initializeCommon = (gateValue: GateValue<any>, direction: Directions, name?: string) => {
        gateValue.valueName = name;
        gateValue.direction = direction;
        this._initializeValueFunction(gateValue);
    };

    constructor(initializeValueFunction: (value: GateValue<any>) => void) {
        this._initializeValueFunction = initializeValueFunction;
    }

    createBoolean = (direction: Directions, name?: string): GateBoolean => {
        const gateValue = new GateBoolean();
        this._initializeCommon(gateValue, direction, name);
        return gateValue;
    }

    createString = (direction: Directions, name?: string): GateString => {
        const gateValue = new GateString();
        this._initializeCommon(gateValue, direction, name);
        return gateValue;
    }

    createInteger = (direction: Directions, name?: string, range?: [number | undefined, number | undefined]): GateNumber => {
        const gateValue = new GateNumber(ValueTypes.integer);
        if (range !== undefined) {
            gateValue.setRange(range);
        }
        this._initializeCommon(gateValue, direction, name);
        return gateValue;
    }

    createFloat = (direction: Directions, name?: string, range?: [number | undefined, number | undefined]): GateNumber => {
        const gateValue = new GateNumber(ValueTypes.float);
        if (range !== undefined) {
            gateValue.setRange(range);
        }
        this._initializeCommon(gateValue, direction, name);
        return gateValue;
    }
}