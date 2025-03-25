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
  
  // Validate pet name exists
  if (!body.pet || !body.pet.name) {
    res.message('Pet name is required');
    res.redirect('/user/' + id);
    return;
  }
  
  // Sanitize pet name
  var petName = String(body.pet.name).trim();
  if (petName === '') {
    res.message('Pet name cannot be empty');
    res.redirect('/user/' + id);
    return;
  }
  
  var pet = { name: petName };
  pet.id = db.pets.push(pet) - 1;
  user.pets.push(pet);
  res.message('Added pet ' + petName);
  res.redirect('/user/' + id);
};