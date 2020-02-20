import * as React from "react";
import { required, between } from "../validators";
import Form from "./form";
import {useEffect, useState} from "react";
import api from "../api/posts";
import posts from "../db/posts.json"

api.init(posts);

const App = () => {

    const [posts, setPosts] = useState([]);

    const updatePosts = (posts: any) => {
        setPosts(posts.filter((post: any) => post.visible))
    };

    const removePost = (post: any) => {
        api.removePost(post);

        updatePosts(api.getAllPosts());
    };

    const createPost = (post: any) => {
        api.addPost({
            ...post,
            tags: post.tags.split(',').map((item: any) => item.trim())
        });

        updatePosts(api.getAllPosts());
    };

    const onSubmit = (post: any) => {
        createPost(post);
    };

    useEffect(() => {
        updatePosts(api.getAllPosts());
    }, []);

    const fields = {
        title: {
            type: 'text',
            label: 'Название',
            value: ''
        },
        body: {
            type: 'text',
            label: 'Описание',
            value: ''
        },
        tags: {
            type: 'text',
            label: 'Теги',
            value: ''
        }
    };

    const validation = {
        title: {
            required: required(true),
            between: between(5, 50)
        },
        body: {
            required: required(true),
            between: between(5, 500)
        },
        tags: {
            required: required(true)
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-12">

                            { posts.map((post: any, index: number) => {
                                const { title, body, tags } = post;

                                return (
                                    <div className="card my-3 p-3" key={`post-${index}`}>
                                        <h5 className={'heading'}>{title}</h5>
                                        <p>
                                            {body}
                                        </p>
                                        <div className={'py-2'}>
                                            <div className="flex">
                                                <div>
                                                    { tags.map((tag: string, index: number) => <button key={`${tag}-${index}`} className={'btn btn-sm btn-primary mr-2'}>{tag}</button>) }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex py-1">
                                            <button onClick={() => removePost(post)} className={'btn btn-sm btn-danger'}>Удалить</button>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="row">
                        <div className="col-6">
                            <Form fields={fields} validation={validation} onSubmit={onSubmit} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default App;