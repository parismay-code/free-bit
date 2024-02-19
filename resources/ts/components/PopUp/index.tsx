import { useEffect } from 'react';
import cn from 'classnames';

import usePopUp from '@hooks/usePopUp';

import { useSelector } from '@stores/rootReducer';

import './popUp.scss';

function PopUp() {
    const { close, prev } = usePopUp();

    const popUpStore = useSelector((state) => state.popUp);

    const popUp = popUpStore.current;

    useEffect(() => {
        window.onkeydown = (event) => {
            if (event.code === 'Escape') {
                close();
            }
        };

        return () => {
            window.onkeydown = null;
        };
    }, [close]);

    return (
        <div
            role="presentation"
            id="popUp"
            className={cn('pop-up', popUp && 'pop-up_visible')}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    close();
                }
            }}
        >
            {popUp && (
                <div className="pop-up__content">
                    <div className="pop-up-header">
                        <h1 className="pop-up-header__title">{popUp.title}</h1>

                        <div className="pop-up-header-controls">
                            {popUpStore.trace.length > 1 && (
                                <button
                                    type="button"
                                    className="pop-up-header-controls__prev"
                                    onClick={prev}
                                >
                                    Назад
                                </button>
                            )}

                            <button
                                type="button"
                                className="pop-up-header-controls__close"
                                onClick={close}
                            >
                                {' '}
                            </button>
                        </div>
                    </div>

                    <div className="pop-up__component">{popUp.component}</div>
                </div>
            )}
        </div>
    );
}

export default PopUp;
