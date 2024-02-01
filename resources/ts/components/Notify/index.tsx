import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import cn from 'classnames';

import type INotify from '@interfaces/models/INotify';

import { useSelector } from '@stores/rootReducer';
import { removeNotify } from '@stores/notifyReducer';

import './notify.scss';
import { AnimatePresence, motion } from 'framer-motion';

function Notify() {
    const [notify, setNotify] = useState<INotify | null>(null);

    const dispatch = useDispatch();

    const showTimeout = useRef<number>();

    const notifyStore = useSelector((state) => state.notify);

    const showNotify = useCallback(() => {
        if (showTimeout.current) {
            clearTimeout(showTimeout.current);
        }

        if (notify) {
            showTimeout.current = setTimeout(() => showNotify(), 1000);
            return;
        }

        if (notifyStore.queue[0]) {
            setNotify(notifyStore.queue[0]);

            setTimeout(() => {
                dispatch(removeNotify());
                setNotify(null);
            }, notifyStore.queue[0].duration);
        } else {
            setNotify(null);
        }
    }, [dispatch, notify, notifyStore.queue]);

    useEffect(() => {
        if (notifyStore.queue.length > 0) {
            showNotify();
        }
    }, [notifyStore.queue.length, showNotify]);

    return (
        <AnimatePresence>
            {notify && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: 10 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 20, x: 10 }}
                    className={cn('notify', `notify_${notify.type}`)}
                >
                    {notify.text}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Notify;
