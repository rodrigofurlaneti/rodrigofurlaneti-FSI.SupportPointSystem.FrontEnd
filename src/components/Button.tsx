import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children: React.ReactNode;
}

export function Button({ loading, children, ...rest }: ButtonProps) {
    return (
        <button
            {...rest}
            disabled={loading || rest.disabled}
            className="w-full bg-check-green hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed text-check-blue font-black py-4 rounded-2xl text-lg mt-4 transition-all flex items-center justify-center gap-2 shadow-lg shadow-check-green/20"
        >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>AUTENTICANDO...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}