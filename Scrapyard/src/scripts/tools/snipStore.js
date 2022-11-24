import {read} from './bridge';
import toUrlEncoded from './toUrlEncoded';

const getSnippets = async ({user, title, language, categories, meta, pageParam, perPage}) => {
    const urlParams = toUrlEncoded({title, language, categories, meta, pageParam, perPage});
    console.log('urlParams', urlParams);
    const response = await read(`${user ? `${user}/` : ''}snippets${urlParams}`);

    if (response.status == 200) {
        return response.msg;
    }

    return response;
};

const getUsers = async () => {
    const response = await read(`users`);

    // console.log(response);
    if (response.status == 200) {
        return response.msg;
    }
    return response;
};

const readCoworkerRules = async () => {
    const response = await read(`coworkerRules`);

    if (response.status == 200) {
        return response.msg;
    }
    return response;
};

const getCategories = async ()=>{
    const response = await read(`categories`);

    if (response.status == 200) {
        return response.msg;
    }
    return response;
}

const getLanguages = async ()=>{
    const response = await read(`languages`);

    if (response.status == 200) {
        return response.msg;
    }
    return response;
}

const commonSnippetFields = [
    //- the attr.key is used as Ref and snippet prop
    {
        type: 'input',
        attr: {
            key: 'title',
            placeholder: 'title',
            name: 'title',
            type: 'text',
        },
    },
    {
        type: 'textarea',
        attr: {
            key: 'descr',
            placeholder: 'description',
            name: 'descr',
            type: 'textarea',
        },
    },
    {
        type: 'CodeSnippet',
        attr: {
            key: 'snippet',
            type: 'snippet',
        },
    },
    {
        type: 'IsPrivate', // used as the component name
        attr: {
            key: 'isPrivate', // used as a ref
            type: 'checkbox', // determins how to handle value
        },
    },
    {
        type: 'Categories',
        attr: {
            key: 'categories',
            type: 'categories',
        },
    },
    {
        type: 'Language',
        attr: {
            key: 'language',
            type: 'language',
        },
    },
];

export {getSnippets, getUsers, readCoworkerRules, commonSnippetFields, getCategories, getLanguages};
