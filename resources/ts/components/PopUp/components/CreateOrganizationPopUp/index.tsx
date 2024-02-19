import { type SyntheticEvent, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import usePopUp from '@hooks/usePopUp';
import useNotify from '@hooks/useNotify';

import { NotifyTypes } from '@interfaces/models/INotify';

import ApiError from '@services/api/ApiError';
import OrganizationsApiService from '@services/api/organizations/OrganizationsApiService';

import GInput from '@components/GInput';

import './createOrganizationPopUp.scss';
import GButton from '@components/GButton';
import { useQueryClient } from 'react-query';

type FormFields = 'avatar' | 'banner' | 'name' | 'description' | 'owner_uid';

const organizationsService = new OrganizationsApiService();

function AddRolePopUp() {
    const [preview, setPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [errors, setErrors] =
        useState<Record<FormFields, Array<string> | undefined>>();

    const notify = useNotify();
    const { close } = usePopUp();

    const queryClient = useQueryClient();

    const form = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.current) {
            return;
        }

        const data = new FormData(form.current);

        const result = await organizationsService.create<FormFields>(data);

        if (result instanceof ApiError) {
            if (result.data) {
                setErrors(result.data.errors);
            }

            return;
        }

        if (result) {
            setErrors(undefined);
            notify('Организация создана', NotifyTypes.SUCCESS);

            await queryClient.invalidateQueries('organizations');
        } else {
            notify('Что-то пошло не так...', NotifyTypes.ERROR);
        }

        close();
    };

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    useEffect(() => {
        return () => {
            if (bannerPreview) {
                URL.revokeObjectURL(bannerPreview);
            }
        };
    }, [bannerPreview]);

    return (
        <div className="create-organization-pop-up">
            <form
                ref={form}
                className="profile-edit__form"
                onSubmit={handleSubmit}
            >
                <div className="profile-edit__group">
                    <h3>Основная информация</h3>

                    <div
                        className={cn(
                            'create-organization-pop-up-banner',
                            errors?.banner &&
                                'create-organization-pop-up-banner_error',
                        )}
                    >
                        <label
                            htmlFor="bannerInput"
                            className="create-organization-pop-up-banner__label"
                        >
                            <div className="create-organization-pop-up-banner-preview">
                                {bannerPreview ? (
                                    <img
                                        className="create-organization-pop-up-banner-preview__image"
                                        src={bannerPreview}
                                        alt=""
                                    />
                                ) : (
                                    <div className="create-organization-pop-up-banner-preview__placeholder" />
                                )}
                            </div>

                            <span>Изменить баннер</span>
                        </label>

                        <input
                            type="file"
                            name="banner"
                            className="create-organization-pop-up-banner__input"
                            id="bannerInput"
                            accept="image/png, image/jpeg"
                            onChange={(event) => {
                                const { files } = event.target;

                                const file = files?.item(0);

                                if (file) {
                                    setBannerPreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                    </div>

                    <div className="profile-edit__horizontal">
                        <div
                            className={cn(
                                'profile-edit-avatar',
                                errors?.avatar && 'profile-edit-avatar_error',
                            )}
                        >
                            <label
                                htmlFor="avatarInput"
                                className="profile-edit-avatar__label"
                            >
                                <div className="profile-edit-avatar-preview">
                                    {preview ? (
                                        <img
                                            className="profile-edit-avatar-preview__image"
                                            src={preview}
                                            alt=""
                                        />
                                    ) : (
                                        <div className="profile-edit-avatar-preview__placeholder" />
                                    )}
                                </div>

                                <span>Изменить аватар</span>
                            </label>

                            <input
                                type="file"
                                name="avatar"
                                className="profile-edit-avatar__input"
                                id="avatarInput"
                                accept="image/png, image/jpeg"
                                onChange={(event) => {
                                    const { files } = event.target;

                                    const file = files?.item(0);

                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>

                        <div className="profile-edit__group">
                            <GInput
                                type="text"
                                title="Название"
                                name="name"
                                autoComplete="off"
                                customClass="profile-edit__input"
                                errors={errors?.name}
                            />

                            <GInput
                                type="text"
                                title="Описание"
                                name="description"
                                autoComplete="off"
                                customClass="profile-edit__input"
                                errors={errors?.description}
                            />

                            <GInput
                                type="text"
                                title="Рег. данные владельца"
                                name="owner_uid"
                                autoComplete="off"
                                customClass="profile-edit__input create-organization-pop-up__input"
                                hint="Номер ID-карты владельца"
                                errors={errors?.owner_uid}
                            />
                        </div>
                    </div>
                </div>

                <GButton title="Создать" submit />
            </form>
        </div>
    );
}

export default AddRolePopUp;
