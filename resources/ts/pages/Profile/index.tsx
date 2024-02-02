import useHeaderTitle from '@hooks/useHeaderTitle';

import { useSelector } from '@stores/rootReducer';

function Profile() {
    const authStore = useSelector((state) => state.auth);

    const { user } = authStore;

    useHeaderTitle(user ? user.name : undefined);

    return user && <div className="profile container">Profile Page</div>;
}

export default Profile;
