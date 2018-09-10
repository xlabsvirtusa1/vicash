'use strict';
const pg = require('pg');
const express = require('express');
const router = express.Router();
const connectionString = process.env.DATABASE_URL || 'postgres://xlabs:1234@localhost:5432/xlabs';

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.end("Welcome to iCash services");
    });

    app.post('/delegate', (req, res) => {
        console.log(req.body.eth_address);
        console.log(req.body.status);
        const results = [];

        pg.connect(connectionString, (err, client, done) => {
            // Handle connection errors
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }
            // SQL Query > Insert Data
            client.query('INSERT INTO delegate_2(eth_address, status) values($1, $2)',
                [req.body.eth_address, req.body.status]);
            // SQL Query > Select Data
            const query = client.query('SELECT * FROM delegate_2 WHERE eth_address=($1)',
                [req.body.eth_address]);

            // Stream results back one row at a time
            query.on('row', (row) => {
                results.push(row);
            });
            // After all data is returned, close connection and return results
            query.on('end', () => {
                done();
                return res.json(results);
            });
        });
    });

    app.get('/delegate', (req, res) => {
        const results = [];
        pg.connect(connectionString, (err, client, done) => {
            // Handle connection errors
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }
            // SQL Query > Select Data
            const query = client.query('SELECT * FROM delegate_2 ORDER BY delegate_id ASC');
            // Stream results back one row at a time
            query.on('row', (row) => {
                results.push(row);
            });
            // After all data is returned, close connection and return results
            query.on('end', () => {
                done();
                return res.json(results);
            });
        });
    });

    app.get('/delegate/:delegate_id', (req, res) => {
        const results = [];
        pg.connect(connectionString, (err, client, done) => {
            // Handle connection errors
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }
            // SQL Query > Select Data
            const query = client.query('SELECT * FROM delegate_2 WHERE delegate_id=($1)',
                [req.params.delegate_id]);
            // Stream results back one row at a time
            query.on('row', (row) => {
                results.push(row);
            });
            // After all data is returned, close connection and return results
            query.on('end', () => {
                done();
                return res.json(results);
            });
        });
    });



    app.put('/kycoperation/:delegate_id', (req, res) => {
        console.log(req.params.delegate_id);
        console.log(req.body.status);
        const results = [];
        pg.connect(connectionString, (err, client, done) => {
            // Handle connection errors
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }
            // SQL Query > Select Data
            client.query('UPDATE delegate_2 SET status=($1) WHERE delegate_id=($2)',
                [req.body.status, req.params.delegate_id]);

            const query = client.query('SELECT * FROM delegate_2 WHERE delegate_id=($1)',
                [req.params.delegate_id]);

            // Stream results back one row at a time
            query.on('row', (row) => {
                results.push(row);
            });
            // After all data is returned, close connection and return results
            query.on('end', () => {
                done();
                return res.json(results);
            });
        });
    });

}