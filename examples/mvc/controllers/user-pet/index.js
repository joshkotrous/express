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
  
  // Check if pet information is available
  if (!body || !body.pet || typeof body.pet.name !== 'string') {
    res.message('Missing or invalid pet information');
    return res.redirect('/user/' + id);
  }
  
  // Sanitize the pet name
  var sanitizedName = body.pet.name
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  var pet = { name: sanitizedName };
  pet.id = db.pets.push(pet) - 1;
  user.pets.push(pet);
  res.message('Added pet ' + sanitizedName);
  res.redirect('/user/' + id);
};