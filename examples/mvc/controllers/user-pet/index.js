'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.name = 'pet';
exports.prefix = '/user/:user_id';

exports.create = function(req, res, next){
  var id = req.params.user_id;
  var user = db.users[id];
  var body = req.body;
  
  if (!user) return next('route');
  
  // Validate that pet information exists
  if (!body.pet || typeof body.pet.name !== 'string') {
    res.message('Error: Valid pet name is required');
    res.redirect('/user/' + id);
    return;
  }
  
  // Basic validation and sanitization
  var petName = body.pet.name.trim();
  
  // Enforce a reasonable maximum length
  if (petName.length > 100) {
    petName = petName.substring(0, 100);
  }
  
  // Ensure the name is not empty after trimming
  if (petName.length === 0) {
    res.message('Error: Pet name cannot be empty');
    res.redirect('/user/' + id);
    return;
  }
  
  var pet = { name: petName };
  pet.id = db.pets.push(pet) - 1;
  user.pets.push(pet);
  
  // When displaying the pet name in a message, escape it to prevent XSS
  var escapedName = petName
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  res.message('Added pet ' + escapedName);
  res.redirect('/user/' + id);
};