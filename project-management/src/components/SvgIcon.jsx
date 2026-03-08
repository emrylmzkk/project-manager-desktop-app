// src/components/SvgIcon.jsx
import icons from "../config/icons.json";

export const SvgIcon = ({ name, size = 20, className = "" }) => {
    const iconString = icons[name];

    if (!iconString) return null;

    return (
        <span
            className={`inline-flex items-center justify-center [&>svg]:w-full [&>svg]:h-full ${className}`}
            style={{ width: size, height: size }}
            dangerouslySetInnerHTML={{ __html: iconString }}
        />
    );
};
