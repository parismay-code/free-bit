import { type HTMLProps, type RefObject, useId, useState } from 'react';
import cn from 'classnames';

import './gInput.scss';

interface GInputProps extends HTMLProps<HTMLInputElement> {
    handleInput?: (value: string) => void;
    reference?: RefObject<HTMLInputElement>;
}

function GInput({
    title,
    name,
    type,
    placeholder,
    defaultValue,
    handleInput,
    reference,
    autoComplete,
}: GInputProps) {
    const [focused, setFocused] = useState<boolean>(false);
    const [filled, setFilled] = useState<boolean>(!!defaultValue);

    const id = useId();

    return (
        <div className="g-input">
            {title && (
                <label
                    className={cn(
                        'g-input__label',
                        placeholder && 'g-input__label_fixed',
                        !placeholder &&
                            (focused || filled) &&
                            'g-input__label_focused',
                    )}
                    htmlFor={id}
                >
                    {title}
                </label>
            )}

            <input
                className="g-input__input"
                ref={reference}
                autoComplete={autoComplete}
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onFocus={() => {
                    setFocused(true);
                }}
                onBlur={() => {
                    setFocused(false);
                }}
                onInput={(event) => {
                    const { value } = event.currentTarget;

                    setFilled(!!value);

                    if (value && handleInput) {
                        handleInput(value);
                    }
                }}
            />
        </div>
    );
}

GInput.defaultProps = {
    handleInput: undefined,
    reference: undefined,
};

export default GInput;
