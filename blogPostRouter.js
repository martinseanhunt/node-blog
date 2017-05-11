const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// Add example posts
BlogPosts.create
	('10 worst blog posts of 2017', 'This is a blog post', 'Me');
BlogPosts.create
	('Man rides a bike, you wont believe what happens next', 'This is another blog post', 'Different person');

router.get('/', (req, res) => {
	return res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author']
	requiredFields.forEach( field => {
		if (!(field in req.body)){
			const message = `You need the ${field} field`;
			console.error(message);
			
			return res.status(400).send(message);
		}
	});
	const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	return res.status(200).json(post);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted post ${req.params.id}`);
	return res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['id', 'title', 'content', 'author'];
	
	requiredFields.forEach( field => {
		if (!(field in req.body)){
			const message = `You need the ${field} field`;
			console.error(message);
			
			return res.status(400).send(message);
		}
	});

	if (req.params.id !== req.body.id){
		const message = 'Id has to match bro!';
		console.error(message);
		return res.status(400).send(message);
	}

	console.log(`about to update ited req.body.id`);

	const updatedPost = BlogPosts.update({
		id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	});

	return res.status(200).json(updatedPost);
})

module.exports = router;