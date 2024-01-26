import './gButton.scss';
import type { SyntheticEvent } from 'react';

interface GButtonProps {
    title: string;
    submit?: boolean;
    onClick?: (event: SyntheticEvent) => void;
}

function GButton({ title, submit, onClick }: GButtonProps) {
    return (
        <button
            type={submit ? 'submit' : 'button'}
            className="g-button"
            onClick={onClick}
        >
            {title}
        </button>
    );
}

GButton.defaultProps = {
    onClick: undefined,
    submit: false,
};

export default GButton;
