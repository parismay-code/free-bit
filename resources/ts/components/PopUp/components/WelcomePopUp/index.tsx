import usePopUp from '@hooks/usePopUp';

import './welcomePopUp.scss';

function WelcomePopUp() {
    const { close } = usePopUp();

    return (
        <div className="welcome-pop-up">
            <p>
                Информация, предоставленная на сайте является РП составляющей
                игры на проекте Amazing FreeRP.
            </p>
            <p>
                Все данные, указываемые при регистрации и прочем использовании
                сайта, должны указываться в соответствии с игровыми данными
                вашего персонажа, если иное явно не указано на сайте.
            </p>
            <p>
                Регистрационные данные - номер ID-карты вашего персонажа, почта
                - ваш дискорд.
            </p>

            <div className="pop-up-controls">
                <button
                    type="button"
                    className="pop-up-controls__close"
                    onClick={() => {
                        localStorage.setItem('acknowledged', '1');
                        close();
                    }}
                >
                    Понятно!
                </button>
            </div>
        </div>
    );
}

export default WelcomePopUp;
