const listHelper = require('../utils/list_helper')

test('dummy requires one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const listWithMultipleBlogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '6j324n52j23n4n2n5j52jj33',
        title: 'Twelve Principles behind the Agile Manifesto',
        author: 'Agile Working Group',
        url: 'https://agilemanifesto.org/principles.html',
        likes: 12,
        __v: 0
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
        _id: '5a422aa71b54a676234d13n1',
        title: 'How I started analyzing algorithms and for the sake of this I went to the USSR',
        author: 'Donald Knuth',
        url: 'https://sudonull.com/post/76923-Donald-Knuth-how-I-started-analyzing-algorithms-and-for-the-sake-of-it-I-went-to-the-USSR-379197-97-',
        likes: 4,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'School Informatics in the USSR: from Literacy to Culture',
        author: 'Andrey P. Ershov',
        url: 'http://ershov.iis.nsk.su/ru/node/768160',
        likes: 17,
        __v: 0
    }
]

describe('total likes', () => {
    test('empty lists has zero', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('when list has multiple blogs, equals the sum of likes', () => {
        const result = listHelper.totalLikes(listWithMultipleBlogs)
        expect(result).toBe(45)
    })
})

describe('favorite blog', () => {
    test('empty list returns no info and zero likes', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toStrictEqual({ likes: 0 })
    })

    test('when list has only one blog, equals that one blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toStrictEqual(
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            })
    })

    test('when list has multiple blogs, equals the sum of likes', () => {
        const result = listHelper.favoriteBlog(listWithMultipleBlogs)
        expect(result).toStrictEqual({
            _id: '5a422aa71b54a676234d17f8',
            title: 'School Informatics in the USSR: from Literacy to Culture',
            author: 'Andrey P. Ershov',
            url: 'http://ershov.iis.nsk.su/ru/node/768160',
            likes: 17,
            __v: 0
        })
    })
})

describe('most prolific author', () => {
    test('empty lists has no author, zero blogs', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toStrictEqual({
            author: 'none',
            blogs: 0
        })
    })

    test('when list has only one blog, equals the author of that', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result).toStrictEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 1
        })
    })

    test('when list has multiple blogs, equals the most prolific author', () => {
        const result = listHelper.mostBlogs(listWithMultipleBlogs)
        expect(result).toStrictEqual({
            author: 'Andrey P. Ershov',
            blogs: 2
        })
    })
})

describe('most beloved author', () => {
    test('empty lists has no author, zero likes', () => {
        const result = listHelper.mostLikes([])
        expect(result).toStrictEqual({
            author: 'none',
            likes: 0
        })
    })

    test('when list has only one blog, equals the likes of the author of that', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result).toStrictEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })

    test('when list has multiple blogs, equals the most liked author', () => {
        const result = listHelper.mostLikes(listWithMultipleBlogs)
        expect(result).toStrictEqual({
            author: 'Andrey P. Ershov',
            likes: 24
        })
    })
})
