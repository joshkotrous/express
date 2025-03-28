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
  
  // Input validation for pet name
  if (!body.pet || typeof body.pet.name !== 'string') {
    res.message('Invalid pet name format!');
    return res.redirect('/pet/' + req.pet.id);
  }
  
  // Trim the name and check length
  var petName = body.pet.name.trim();
  if (petName.length === 0 || petName.length > 100) {
    res.message('Pet name must be between 1 and 100 characters!');
    return res.redirect('/pet/' + req.pet.id);
  }
  
  req.pet.name = petName;
  res.message('Information updated!');
  res.redirect('/pet/' + req.pet.id);
};