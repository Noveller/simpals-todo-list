const setPosts = (posts: any) => {
    localStorage.setItem('posts', JSON.stringify(posts));
};

export default {
    init(initialData: any) {
        const posts = localStorage.getItem('posts');
        !posts && localStorage.setItem('posts', JSON.stringify(initialData.map((post: any) => {
            return {...post, visible: true}
        })));
    },
    getAllPosts() {
        const posts = JSON.parse(localStorage.getItem('posts'));

        if (!Array.isArray(posts)) return [];

        return posts;
    },
    removePost(post: any) {
        const posts = this.getAllPosts();

        localStorage.setItem('posts', JSON.stringify(posts.map((item: any) => {
            if (item.id === post.id) {
                return { ...item, visible: false }
            }

            return item;
        })));
    },
    addPost(post: any) {
        const posts = this.getAllPosts();

        if (!posts.length) {
            setPosts([...posts, {...post, id: 1}]);
        } else {
            setPosts([...posts, { ...post, id: Math.max(...posts.map((item: any) => item.id)) + 1, visible: true }]);
        }
    }
}