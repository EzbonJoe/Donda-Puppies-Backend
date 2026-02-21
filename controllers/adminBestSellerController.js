const Puppy = require('../models/PuppyModel');


const setBestSeller = async(req, res) => {
  const { bestSeller } = req.body; // expect { bestSeller: true/false }

  try{
    const puppy = await Puppy.findById(req.params.id);
    if (!puppy) return res.status(404).json({ message: 'Puppy not found' });

    puppy.bestSeller = bestSeller;
    await puppy.save();

    res.json({ message: `Puppy "${puppy.name}" bestSeller updated to ${bestSeller}`, puppy });
  }catch(err){
    console.error('Error updating bestSeller:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  setBestSeller
}