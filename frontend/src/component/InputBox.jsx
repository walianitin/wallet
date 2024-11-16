export function InputBox({ label, placeholder, value, onChange, name, ...props }) {
    return (
        <div>
            <div className="text-sm font-medium text-left py-2">
                {label}
            </div>
            <input
                placeholder={placeholder}
                value={value}
                name={name}
                onChange={onChange}
                className="w-full px-2 py-1 border rounded border-slate-200"
                {...props}  // Now, this will work because it's the last item
            />
        </div>
    );
}
