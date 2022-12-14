import React, {useState, memo, useRef, useEffect} from 'react';
import {useOutletContext} from 'react-router-dom';

import {commonSnippetFields, getUser} from '../tools/snipStore';
import {read, remove} from '../tools/bridge';
import Form from './form/form';
import {FaLock, FaLockOpen} from 'react-icons/fa';
import CodeSnippet from './form/fields/snippet';

type propsT = {
    snippet: {
        id: string;
        user: string;
        title: string;
        descr: string;
        snippet: string;
        isPrivate: Boolean;
        author: string;
        language: string;
        categories: string;
        access: {read: Boolean; update: Boolean; delete: Boolean};
    };
};

function Snippet(props: propsT) {
    const {notify} = useOutletContext();

    const [snipInfoState, setSnipInfoState] = useState({
        snippet: props.snippet,
    });
    // console.log(snipInfoState.snippet);

    const [popUpState, setPopUpState] = useState({showForm: false});

    // fetching avatar for the snippet
    const avatarRef = useRef(null);
    const fetchAvatar = async () => {
        const userInfo = await getUser(snipInfoState.snippet.user);
        // console.log(userInfo.avatar)
        if (avatarRef.current) {
            avatarRef.current.src = userInfo.avatar;
        }
    };
    useEffect(() => {
        fetchAvatar();
    }, []);

    const formFieldsState = useRef({
        fields: Object.values(structuredClone({commonSnippetFields}))[0],
    });

    const updateFields = () => {
        formFieldsState.current.fields.forEach((field) => {
            if (field.attr.type == 'checkbox') {
                field.attr.defaultChecked = snipInfoState.snippet[field.attr.key];
            } else {
                if (field.attr.type == 'snippet') {
                    field.attr.readOnly = true;
                }
                // console.log(snipInfoState.snippet.id, snipInfoState.snippet[field.attr.key]);
                field.attr.defaultValue = snipInfoState.snippet[field.attr.key];
            }
        });
        //console.log(formFieldsState.current.fields);
    };

    // useEffect() would be better with this
    // I need to to modify some data before even running the jsx functions
    const firstRender = useRef(true);
    if (firstRender.current) {
        updateFields();
        firstRender.current = false;
    }
    // ditsh this: useEffect(() => {}, []);

    const handleEdit = (e) => {
        e.stopPropagation();
        if (snipInfoState.snippet.access?.update) {
            formFieldsState.current.fields.forEach((field) => {
                if (field.attr.type == 'snippet') {
                    field.attr.readOnly = false;
                }
            });
            setPopUpState({showForm: true});
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        // console.log('sdfkljsdfj');

        if (snipInfoState.snippet.access?.delete) {
            // console.log(snipInfoState.snippet);
            const response = await remove(
                snipInfoState.snippet.user + '/' + snipInfoState.snippet.id
            );
            props.update();
            notify({type: 'info', msg: response.msg});
        }
    };
    // console.log(snipInfoState.snippet);
    const classes = {
        buttons: 'flex justify-around mt-[20px]',
        button: 'w-[100px] py-[4px] rounded-md',
        btnEdit: `${
            snipInfoState.snippet.access?.update
                ? 'bg-lime-700 font-bold'
                : 'bg-gray-400 text-[#222] font-bold cursor-not-allowed'
        }`,
        btnDelete: `${
            snipInfoState.snippet.access?.delete
                ? 'bg-red-700 font-bold'
                : 'bg-gray-400 font-bold text-[#222] cursor-not-allowed'
        }`,
    };

    const updateEditedSnippet = async () => {
        const response = await read(
            `${snipInfoState.snippet.user}/${snipInfoState.snippet.id}`
        );
        if (response?.status == 200) {
            // console.log('reading new version');

            // updateFields();
            firstRender.current = true; // to update the fields

            setSnipInfoState({snippet: response.msg});
        }
    };
    const hidePopUp = () => {
        setPopUpState({showForm: false});
    };

    // console.log(Object.values(formFieldsState.current.fields)[2].attr);
    // console.log(snipInfoState.snippet);
    return (
        <>
            <div
                data-key={snipInfoState.snippet.id}
                className={`bg-[#292929] rounded-md w-full max-w-[600px]`}
            >
                <div className={`snippet flex flex-col max-w-[600px]  p-6`}>
                    {/* Owner and Author and Privacy*/}
                    <div className='flex justify-between mb-4 gap-3'>
                        {/* Owner */}
                        <div className='flex flex-row gap-3'>
                            <figure
                                className='border-primary border-[1px]
                                                    w-[50px] h-[50px] rounded-full
                                                       overflow-hidden'
                            >
                                <img
                                    ref={avatarRef}
                                    className='w-full h-full'
                                    crossOrigin='anonymous | use-credentials'
                                    src=''
                                ></img>
                            </figure>
                            <p>
                                <span>{snipInfoState.snippet.user}</span>
                                <br />
                                <span className='text-[#939393] text-sm'>
                                    @{snipInfoState.snippet.user}
                                </span>
                            </p>
                        </div>
                        {/* Author */}
                        {snipInfoState.snippet.author != snipInfoState.snippet.user ? (
                            <div className='grow-2'>
                                Author: @{snipInfoState.snippet.author}
                            </div>
                        ) : (
                            <></>
                        )}
                        {/* is Private */}
                        <p>
                            {snipInfoState.snippet.isPrivate ? (
                                <FaLock className='text-orange-500' />
                            ) : (
                                <FaLockOpen className='text-primary' />
                            )}
                        </p>
                    </div>
                    {/* Title */}
                    <h2 className='text-xl text-gray-300 mb-4'>
                        {snipInfoState.snippet.title}
                    </h2>

                    {/* Description */}
                    <details className='mb-4'>
                        <summary className='mb-2 cursor-pointer w-max'>
                            Description
                        </summary>
                        <p className='text-[#939393]'>{snipInfoState.snippet.descr}</p>
                    </details>
                    <details className='mb-4'>
                        <summary className='mb-2 cursor-pointer w-max'>
                            Categories:
                        </summary>
                        <ul className='mr-3 flex flex-wrap'>
                            {snipInfoState.snippet.categories
                                .split(' ')
                                .map((category) => (
                                    <li
                                        key={category}
                                        className='inline ml-2 border-[1px]
                                          border-primary rounded-xl p-1 px-2'
                                    >
                                        {category}
                                    </li>
                                ))}
                        </ul>
                    </details>
                    <h3 className='text-md text-gray-300 mb-3'>
                        Snippet:
                        <p className='inline ml-2 border-[1px] border-primary rounded-xl p-1 px-2'>
                            {snipInfoState.snippet.language}
                        </p>
                    </h3>
                    {/* Snippet */}
                    <CodeSnippet
                        {...formFieldsState.current.fields.filter(
                            (field) => field.type == 'CodeSnippet'
                        )[0].attr}
                        readOnly={true}
                    />

                    {/* Actions */}
                    <div className={`${classes.buttons}`}>
                        <button
                            onClick={handleEdit}
                            className={`${classes.button} ${classes.btnEdit}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className={`${classes.button} ${classes.btnDelete} `}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            {popUpState.showForm ? (
                <Form
                    action='edit'
                    fields={formFieldsState.current.fields}
                    hidePopUp={hidePopUp}
                    snipId={snipInfoState.snippet.id}
                    snipUser={snipInfoState.snippet.user}
                    updateEditedSnippet={updateEditedSnippet}
                />
            ) : (
                <></>
            )}
        </>
    );
}
export default memo(Snippet);
