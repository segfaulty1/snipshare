import React from 'react';
import {useEffect} from 'react';

export default function Notify(props) {
    // console.log('props', props);

    const classes = {
        container: 'p-3 mb-3 rounded-md text-black font-bold',
    };

    const notificationType = {
        info: 'bg-blue-400 ',
        warning: 'bg-yellow-400 ',
        error: 'bg-red-400 ',
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            // hiding notification form the DOM before the parent unmounts it
        }, 2000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div
            aria-label="notification"
            className={`${classes.container} ${notificationType[props.type]}`}
        >
            <p>{typeof props.msg == 'string' ? props.msg : 'msg string was not provided'}</p>
        </div>
    );
}