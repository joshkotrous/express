'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.name = 'pet';
exports.prefix = '/user/:user_id';

// Simple sanitization function to remove potentially harmful characters
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  // Basic sanitization: remove HTML tags and trim
  return input.replace(/<[^>]*>/g, '').trim();
}

exports.create = function(req, res, next){
  var id = req.params.user_id;
  var user = db.users[id];
  var body = req.body;
  
  if (!user) return next('route');
  
  // Validate that pet data exists
  if (!body.pet || typeof body.pet !== 'object' || !body.pet.name) {
    res.message('Invalid pet data');
    return res.redirect('/user/' + id);
  }
  
  // Sanitize the pet name
  var sanitizedPetName = sanitizeInput(body.pet.name);
  
  // Create pet with sanitized name
  var pet = { name: sanitizedPetName };
  pet.id = db.pets.push(pet) - 1;
  user.pets.push(pet);
  
  res.message('Added pet ' + sanitizedPetName);
  res.redirect('/user/' + id);
};