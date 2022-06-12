const lodash = require('lodash')

const initialBlogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Twelve Principles behind the Agile Manifesto',
        author: 'Agile Working Group',
        url: 'https://agilemanifesto.org/principles.html',
        likes: 12,
    },
    {
        _id: '5a422aa71b54a676234d17f2',
        title: 'Aesthetics and the Human Factor in Programming',
        author: 'Andrey P. Ershov',
        url: 'http://www.softpanorama.org/Articles/Ershov/aesthetics_and_the_human_factor_in_programming_ershov1972.shtml',
        likes: 7,
        __v: 0
    },
    {
        title: 'How I started analyzing algorithms and for the sake of this I went to the USSR',
        author: 'Donald Knuth',
        url: 'https://sudonull.com/post/76923-Donald-Knuth-how-I-started-analyzing-algorithms-and-for-the-sake-of-it-I-went-to-the-USSR-379197-97-',
        likes: 4,
    },
    {
        title: 'School Informatics in the USSR: from Literacy to Culture',
        author: 'Andrey P. Ershov',
        url: 'http://ershov.iis.nsk.su/ru/node/768160',
    }
]

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
                favBlog.likes > (blog.likes||0)
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
                    (partLikes, work) => partLikes + (work.likes||0),
                    0
                ) > mostProlific.likes 
                    ? { 
                        author: author, 
                        likes: works
                            .reduce(
                                (partLikes, work) => partLikes + (work.likes||0),
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
    mostLikes,
    initialBlogs
}