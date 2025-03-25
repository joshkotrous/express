'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

exports.engine = 'ejs';

exports.before = function(req, res, next){
  var pet = db.pets[req.params.pet_id];
  if (!pet) return next('route');
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
  
  // Validate that body.pet exists and name is a string
  if (!body.pet || typeof body.pet.name !== 'string') {
    res.message('Invalid pet name format.');
    return res.redirect('/pet/' + req.pet.id + '/edit');
  }
  
  // Trim the input and validate it's not empty
  var sanitizedName = body.pet.name.trim();
  if (sanitizedName === '') {
    res.message('Pet name cannot be empty.');
    return res.redirect('/pet/' + req.pet.id + '/edit');
  }
  
  // Check name length is reasonable
  if (sanitizedName.length > 100) {
    res.message('Pet name is too long (maximum 100 characters).');
    return res.redirect('/pet/' + req.pet.id + '/edit');
  }
  
  // Assign the validated and sanitized name
  req.pet.name = sanitizedName;
  
  res.message('Information updated!');
  res.redirect('/pet/' + req.pet.id);
};