interface DeviceHeaderProps {
    name: string
}

const DeviceHeader = (props: DeviceHeaderProps) => {
    const {name} = props;

    return (
        <div>
            {name}
        </div>
    )
}

export default DeviceHeader;
