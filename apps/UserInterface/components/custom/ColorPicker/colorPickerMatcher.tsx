import {DeviceModel, GateValueModel} from "@stargate-system/model";
import ColorPicker from "@/components/custom/ColorPicker/ColorPicker";
import {
    CustomDeviceMatcher
} from "@/components/SystemPage/CardDisplay/cards/DevicesDashboard/DeviceGroup/Device/Device";

// Defining method to find out if given deviceModel represents device we are interested in
const isColorPicker = (deviceModel: DeviceModel) => {
    // Checking for devices tagged as 'color' on info field
    return deviceModel.info.value === 'color';
}

// Defining method to filter out values that will be used by custom component
// (values not filtered will be displayed normally)
const filterValues = (values: GateValueModel[]) => {
    // returning true only if value is not tagged as 'color:xxx' on its info field
    // (values tagged as 'color:xxx' will be used by ColorPicker component)
    return values.filter((value) => {
        return value.gateValue.info === undefined || value.gateValue.info.match(/^color:/) === null;
    });
}

// Defining method that will return instance of custom component
const getInstance = (key: string, deviceModel: DeviceModel) => {
    return <ColorPicker deviceModel={deviceModel} key={key}/>
}

// Following CustomDeviceMatcher interface
export const colorPickerMatcher: CustomDeviceMatcher = {
    isCustom: isColorPicker,
    filterValues,
    getInstance
}