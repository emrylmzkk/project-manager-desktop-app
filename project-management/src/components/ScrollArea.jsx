// src/components/ScrollArea.jsx
export const ScrollArea = ({ as: Component = "div", children, className = "", ...props }) => {
    return (
        <Component className={`mac-scrollbar overflow-auto ${className}`} {...props}>
            {children}
        </Component>
    );
};
