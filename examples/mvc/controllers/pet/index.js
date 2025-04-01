'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.engine = 'ejs';

exports.before = function(req, res, next){
  var petId = req.params.pet_id;
  
  // Check if petId is valid and a direct property of db.pets
  if (!petId || !Object.prototype.hasOwnProperty.call(db.pets, petId)) {
    return next('route');
  }
  
  var pet = db.pets[petId];
  
  // Additional check to ensure pet is not falsy
  if (!pet) {
    return next('route');
  }
  
  req.pet = pet;
  next();
};

exports.show = function(req, res, next){
  res.render('show', { pet: req.pet });
};

exports.edit = function(req, res, next){
  res.render('edit', { pet: req.pet });
};

exports.update = function(req, res, next){
  var body = req.body;
  
  // Validate that body.pet exists and has a valid name property
  if (!body.pet || typeof body.pet.name !== 'string') {
    res.message('Invalid pet name provided');
    return res.redirect('/pet/' + req.pet.id + '/edit');
  }
  
  // Validate the name is not too long
  if (body.pet.name.length > 100) {
    res.message('Pet name is too long');
    return res.redirect('/pet/' + req.pet.id + '/edit');
  }
  
  // Sanitize the input by trimming whitespace
  var sanitizedName = body.pet.name.trim();
  
  req.pet.name = sanitizedName;
  res.message('Information updated!');
  res.redirect('/pet/' + req.pet.id);
};