const Puppy = require('../models/PuppyModel');

const getBestSellingPuppies = async(req, res) => {
    try{
    	const bestSellers = await Puppy.find({ bestSeller: true, isAvailable: true });
    	res.json(bestSellers);
    }catch (error) {
			console.error('Error fetching best-selling puppies:', err);
    	res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
	getBestSellingPuppies
}