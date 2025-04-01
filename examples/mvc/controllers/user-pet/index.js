'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

/**
 * Escapes HTML to prevent XSS attacks
 */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

exports.name = 'pet';
exports.prefix = '/user/:user_id';

exports.create = function(req, res, next){
  var id = req.params.user_id;
  var user = db.users[id];
  var body = req.body;
  
  if (!user) return next('route');
  
  // Check if pet data exists
  if (!body.pet || !body.pet.name) {
    res.message('Pet name is required');
    return res.redirect('/user/' + id);
  }
  
  // Check if pet name is a string
  if (typeof body.pet.name !== 'string') {
    res.message('Pet name must be text');
    return res.redirect('/user/' + id);
  }
  
  // Sanitize the pet name by trimming it
  var petName = body.pet.name.trim();
  
  // Check if pet name is empty after trimming
  if (petName === '') {
    res.message('Pet name cannot be empty');
    return res.redirect('/user/' + id);
  }
  
  // Check pet name length and character set
  if (petName.length > 50 || !/^[a-zA-Z0-9 .'_-]+$/.test(petName)) {
    res.message('Pet name must be 1-50 characters and contain only letters, numbers, spaces, and basic punctuation');
    return res.redirect('/user/' + id);
  }
  
  var pet = { name: petName };
  pet.id = db.pets.push(pet) - 1;
  user.pets.push(pet);
  res.message('Added pet ' + escapeHtml(petName));
  res.redirect('/user/' + id);
};