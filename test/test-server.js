const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// Enables chai .should tests
const should = chai.should();

// Enables HTTP requests through chai
chai.use(chaiHttp);

// Start the tests
describe('Blog Posts', function() {

	before(function() {
		// why do these have to return the function? Guessing something I'm missing about promises
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	it('should lost all posts on GET', function() {
		// again, why are we returning the chai function
		return chai.request(app)
			.get('/blog-posts')
			.then( function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.length.should.be.at.least(1);

				const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
				res.body.forEach(function(item) {
					item.should.be.a('object');
					item.should.include.keys(expectedKeys);
				});
			});
	});

	it('should create a new post on POST', function() {
		const newBlogPost = {
			title: 'Super cool new blog post',
			content: 'omg, this is the best blog post ever',
			author: 'some blogger'
		}
		return chai.request(app)
			.post('/blog-posts')
			.send(newBlogPost)
			.then(function (res) {
				res.should.have.status(200);
				res.should.be.json;
				res.should.be.a('object');
				res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
				res.body.should.deep.equal(Object.assign(newBlogPost, {id: res.body.id, publishDate: res.body.publishDate}));
			});
	});

	it('should delete a post on DELETE', function() {
		// we need an item to delete
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				return chai.request(app)
					.delete(`/blog-posts/${res.body[0].id}`)
					.then(function(res) {
						res.should.have.status(204);
					});
			});
	});

	it('should update a post on PUT', function() {
		const postUpdates = {
			title: 'Super cool updated blog post',
			content: 'omg, this is the worst blog post ever',
			author: 'some other blogger'
		}
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				postUpdates.id = res.body[0].id;
				return chai.request(app)
					.put(`/blog-posts/${postUpdates.id}`)
					.send(postUpdates)
					.then(function(res) {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.deep.equal(Object.assign(postUpdates, {id: res.body.id, publishDate: res.body.publishDate}));
					});
			});
	})
});
