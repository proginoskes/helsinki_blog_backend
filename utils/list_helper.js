const lodash = require('lodash')

const dummy = (blogs) => {
    console.log(blogs)
    return 1
}

const totalLikes = (blogs) => {
    return(
        blogs
            .reduce((likeSum, blog) => (
                likeSum + blog.likes
            ), 0)
    )
}

const favoriteBlog = (blogs) => {
    return(
        blogs
            .reduce((favBlog, blog) => (
                favBlog > blog 
                    ? favBlog
                    : blog
            ), { likes: 0 })
    )
}

const mostBlogs = (blogs) => {
    return(
        Object.entries(lodash.groupBy(blogs, blog => blog.author))
            .reduce((mostProlific, [author, works]) => (
                works.length > mostProlific.blogs 
                    ? { author: author, blogs: works.length}
                    : mostProlific
            ), { author: 'none',  blogs: 0 })
            
    )
}

const mostLikes = (blogs) => {
    return(
        Object.entries(lodash.groupBy(blogs, blog => blog.author))
            .reduce((mostProlific, [author, works]) => (
                works.reduce(
                    (partLikes, work) => partLikes + work.likes,
                    0
                ) > mostProlific.likes 
                    ? { 
                        author: author, 
                        likes: works
                            .reduce(
                                (partLikes, work) => partLikes + work.likes,
                                0
                            )
                    }
                    : mostProlific
            ), { author: 'none',  likes: 0 })
    )
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}