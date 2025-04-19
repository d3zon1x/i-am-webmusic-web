import { Range } from "react-range";

const VolumeSlider = ({ volume, onChange }) => {
    return (
        <div className="w-[100px]">
            <Range
                step={0.01}
                min={0}
                max={1}
                values={[volume]}
                onChange={(values) => onChange(values[0])}
                renderTrack={({ props, children }) => {
                    const { key, ...trackProps } = props;

                    return (
                        <div
                            {...trackProps}
                            style={{
                                ...trackProps.style,
                                height: "6px",
                                width: "100%",
                                background: `linear-gradient(to right, #ff4d4d ${volume * 100}%, #444 ${volume * 100}%)`,
                                borderRadius: "4px",
                            }}
                        >
                            {children}
                        </div>
                    );
                }}
                renderThumb={({ props }) => {
                    const { key, ...thumbProps } = props;

                    return (
                        <div
                            {...thumbProps}  // Передаємо тільки без key
                            style={{
                                ...thumbProps.style,
                                height: "14px",
                                width: "14px",
                                backgroundColor: "#ff4d4d",
                                borderRadius: "50%",
                            }}
                        />
                    );
                }}
            />
        </div>
    );
};

export default VolumeSlider;
