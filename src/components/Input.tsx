import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    isPassword?: boolean;
}

export function Input({ label, isPassword, ...rest }: InputProps) {
    const [show, setShow] = useState(false);
    const type = isPassword ? (show ? 'text' : 'password') : rest.type;

    return (
        <div className="space-y-1 w-full">
            <label className="text-[10px] font-bold uppercase tracking-widest text-check-green ml-2">
                {label}
            </label>
            <div className="relative">
                <input
                    {...rest}
                    type={type}
                    className="w-full bg-white text-slate-900 p-4 rounded-2xl outline-none font-bold placeholder:font-normal"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-check-blue"
                    >
                        {show ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                )}
            </div>
        </div>
    );
}