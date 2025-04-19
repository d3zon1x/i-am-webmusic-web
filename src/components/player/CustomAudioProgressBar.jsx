import { Range } from "react-range";

const CustomAudioProgressBar = ({ progress, duration, onChange }) => {
    return (
        <div className="w-full">
            <Range
                step={0.1}
                min={0}
                max={duration || 1}
                values={[progress]}
                onChange={(values) => onChange(values[0])}
                renderTrack={({ props, children }) => {
                    return (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                height: '8px',
                                width: '100%',
                                background: `linear-gradient(to right, #ff4d4d ${progress / duration * 100}%, #444 ${progress / duration * 100}%)`,
                                borderRadius: '4px',
                            }}
                        >
                            {children}
                        </div>
                    );
                }}
                renderThumb={({ props, index }) => {
                    return (
                        <div
                            {...props} 
                            key={`thumb-${index}`} 
                            style={{
                                ...props.style,
                                height: '14px',
                                width: '14px',
                                backgroundColor: '#ff4d4d',
                                borderRadius: '50%',
                                boxShadow: '0 0 2px #000',
                            }}
                        />
                    );
                }}
            />
        </div>
    );
};

export default CustomAudioProgressBar;
