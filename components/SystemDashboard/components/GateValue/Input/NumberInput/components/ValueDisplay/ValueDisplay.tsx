
interface ValueDisplayProps {
    value: number,
    setValue: (value: number) => void
}

const ValueDisplay = (props: ValueDisplayProps) => {
    const {value, setValue} = props;

    // @ts-ignore
    return <input type='number' value={value} onInput={(ev) => setValue(ev.target.value)}/>
}

export default ValueDisplay;
