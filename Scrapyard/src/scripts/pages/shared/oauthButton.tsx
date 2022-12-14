import React from 'react';
import {useNavigate} from 'react-router';
import {read} from '../../tools/bridge';

export default function OauthButton() {
    const navigate = useNavigate();

    const sendIdToken = async () => {
        const fragId = window.location.hash;
        if (fragId != '') {
            const idToken = fragId.split('&')[0].split('=')[1];
            // console.log('idToken', idToken);

            const response = await read(`api/auth/google?idToken=${idToken}`);
            if (response.status == 200) {
                navigate('/', {replace: true});
            }
        }
    };

    React.useEffect(() => {
        sendIdToken();
    }, []);

    const handleOAuth = (e:MouseEvent) => {
        e.preventDefault();

        window.open('http://127.0.0.1:2000/auth/google', '_self');
    };

    return (
        <button className='w-[200px] border-2 border-primary mt-4 p-2 rounded-md' onClick={handleOAuth}>
            Login With Google
        </button>
    );
}
