import { type HTMLProps, type RefObject, useId, useState } from 'react';
import cn from 'classnames';

import './gInput.scss';

interface GInputProps extends HTMLProps<HTMLInputElement> {
    handleInput?: (value: string) => void;
    reference?: RefObject<HTMLInputElement>;
    hint?: string;
    errors?: Array<string>;
    customClass?: string;
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
    hint,
    errors,
    customClass,
}: GInputProps) {
    const [focused, setFocused] = useState<boolean>(false);
    const [filled, setFilled] = useState<boolean>(!!defaultValue);

    const id = useId();

    return (
        <div
            className={cn(
                'g-input',
                focused && hint && 'g-input_hint',
                customClass,
            )}
        >
            {hint && (
                <div className={cn('g-input__hint', focused && 'visible')}>
                    {hint}
                </div>
            )}

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
                className={cn(
                    'g-input__input',
                    errors && 'g-input__input_error',
                )}
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

            {errors && (
                <div className="g-input-errors">
                    {errors.map((el) => {
                        return (
                            <div key={el} className="g-input-errors__error">
                                {el}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

GInput.defaultProps = {
    handleInput: undefined,
    reference: undefined,
    hint: undefined,
    errors: undefined,
    customClass: undefined,
};

export default GInput;
