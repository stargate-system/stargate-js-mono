import { GateValueModel } from "@stargate-system/model";
import { useEffect, useRef, useState } from "react";
import styles from './NumberChartArea.module.css';
import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";

interface NumberChartAreaProps {
    min: number,
    max: number,
    span: number
    model: GateValueModel,
    isActive: boolean
}

const resolution = 200;

const NumberChartArea = (props: NumberChartAreaProps) => {
    const {min, max, span, model, isActive} = props;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [data, setData] = useState<(number | undefined)[]>([]);

    useEffect(() => {
        if (canvasRef.current && containerRef.current) {
            const width = containerRef.current.clientWidth;
            const height = width * 0.5;
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.canvas.width = width;
                ctx.canvas.height = height;

                ctx.beginPath();
                ctx.strokeStyle = '#606060';
                ctx.lineWidth = 1;
                const verticalGrid = 4;
                const verticalSpan = width/(verticalGrid + 1);
                for(let i = 1; i <= verticalGrid; i++) {
                    const x = i * verticalSpan;
                    ctx.moveTo(x + 0.5, 0);
                    ctx.lineTo(x + 0.5, height);
                }
                const horizontalGrid = 3;
                const horizontalSpan = height/(horizontalGrid + 1);
                for(let i = 1; i <= horizontalGrid; i++) {
                    const y = i * horizontalSpan;
                    ctx.moveTo(0, y + 0.5);
                    ctx.lineTo(width, y + 0.5);
                }
                ctx.stroke();

                const xFactor = width / resolution;
                const yFactor = height / Math.abs(max - min);
                ctx.beginPath();
                ctx.strokeStyle = '#2ef621';
                let pointAvailable = data[0] !== undefined;
                if (pointAvailable) {
                    // @ts-ignore
                    ctx.moveTo(width, height - (yFactor * (data[0] - min)));
                }
                for (let i = 1; i < data.length; i++) {
                    if (pointAvailable) {
                        if (data[i] !== undefined) {
                            // @ts-ignore
                            let dataPoint = (data[i] - min)*yFactor;
                            if (dataPoint > height) {
                                dataPoint = height;
                            } else if (dataPoint < 0) {
                                dataPoint = 0;
                            }
                            ctx.lineTo(width - i*xFactor, height - dataPoint);
                        } else {
                            pointAvailable = false;
                        }
                    } else if (data[i] !== undefined) {
                        pointAvailable = true;
                        // @ts-ignore
                        let dataPoint = (data[i] - min)*yFactor;
                        if (dataPoint > height) {
                            dataPoint = height;
                        } else if (dataPoint < 0) {
                            dataPoint = 0;
                        }
                        ctx.moveTo(width - i*xFactor, height - dataPoint);
                    }
                }
                ctx.stroke();
            }
        }
    }, [data, min, max]);

    useEffect(() => {
        data.splice(0);
        setData([]);
        const frameTime = Math.round(1000 * span / resolution);
        const collectData = () => {
            data.unshift(isActive ? model.gateValue.value : undefined);
            if (data.length > resolution) {
                data.splice(resolution);
            }
            setData([...data]);
        }
        const key = setInterval(collectData, frameTime);

        return () => clearInterval(key);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [span]);

    return (
        <div ref={containerRef} className={styles.chartAreaContainer}>
            <canvas className={styles.canvas} ref={canvasRef}/>
        </div>
    )
}

export default NumberChartArea;
