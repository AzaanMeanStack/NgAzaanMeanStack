/**
 * Author : Shoukath Mohammed
 * Date   : 05/01/2016
 * Time   : 08:00 PM EST
 * Created with eclipse
 * MEAN STACK Restful API
 */

//DB configuration
var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist', ['contactlist']);
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());

// handles 'GET' requests, fetch all contacts in the list
app.get('/contactlist', function (req, res) {
  db.contactlist.find(function (err, docs) {
    res.json(docs);
  });
});

//handles 'POST' requests
app.post('/contactlist', function (req, res) {
  db.contactlist.insert(req.body, function(err, doc) {
    res.json(doc);
  });
  console.log(req.body);
});

//handles 'DELETE' requests
/*app['delete']('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  db.contactlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});*/

//handles 'GET' requests, fetch a specific record
app.get('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.params);
  db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

//handles 'PUT' requests, updates a record
app.put('/contactlist/:id', function (req, res) {
    var id = req.params.id;
    var now =  new Date();
    var itemType = req.body.operation;

    if (req.body.operation == 'UPDATE_PRAYER') {
        updatePrayer(id, now, req, res);
    } else if (req.body.operation == 'ADD_PRAYER') {
        addPrayer(id, now, req, res);
    }
});

//handles 'DELETE' requests
app['delete']('/contactlist/:id', function (req, res) {
    var id = req.params.id;
    var itemType = req.body.itemType;

    switch (itemType) {
    case 'PRAYER':
        deletePrayer(id, req, res);
        break;
    case 'EVENT':
        deleteEvent(id, req, res);
        break;
    case 'ANNOUNCEMENT':
        deleteAnnouncement(id, req, res);
        break;
    default:
        deleteOrganization(id, req, res);
    }
});

function updatePrayer(id, now, req, res) {
    db.contactlist.findAndModify({
        query: {
            _id: mongojs.ObjectId(id),
            'prayer.id': req.body.id
        },
        update: {
            $set: {
                'prayer.$.salah': req.body.salah,
                'prayer.$.iqama': req.body.iqama,
                'prayer.$.lastUpdated': now.toJSON()
            }
        }
    }, function(err, doc) {
        res.json(doc);
    });
}

function updateEvent(id, now, req, res) {
    db.contactlist.findAndModify({
        query: {
            _id: mongojs.ObjectId(id),
            'events.id': req.body.id
        },
        update: {
            $set: {
                'events.$.time': req.body.time,
                'events.$.date': req.body.date,
                'events.$.notes': req.body.notes,
                'events.$.name': req.body.name,
                'events.$.lastUpdated': now.toJSON()
            }
        }
    }, function(err, doc) {
        res.json(doc);
    });
}

function updateAnnouncement(id, now, req, res) {
    db.contactlist.findAndModify({
        query: {
            _id: mongojs.ObjectId(id),
            'announcements.id': req.body.id
        },
        update: {
            $set: {
                'announcements.$.date': req.body.date,
                'announcements.$.notes': req.body.notes,
                'announcements.$.lastUpdated': now.toJSON()
            }
        }
    }, function(err, doc) {
        res.json(doc);
    });
}

function addPrayer(id, now, req, res) {
    db.contactlist.findAndModify({
        query: {
            _id: mongojs.ObjectId(id)
        },
        update: {
            $push: {
                'prayer': {
                    'id': req.body.id,
                    'salah': req.body.salah,
                    'iqama': req.body.iqama,
                    'lastUpdated': now.toJSON()
                }
            }
        }
    }, function(err, doc) {
        res.json(doc);
    });
}

function deletePrayer(id, req, res) {
    db.contactlist.update({
        _id: mongojs.ObjectId(id)
    }, {
        $pull : {"prayer" : {"id": req.body.id}}
    }, function(err, doc) {
        res.json(doc);
    });
}

function deleteOrganization(id, req, res) {
    db.contactlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
        res.json(doc);
    });
}

function deleteEvent(id, req, res) {
    db.contactlist.update({
        _id: mongojs.ObjectId(id)
    }, {
        $pull : {"events" : {"id": req.body.id}}
    }, function(err, doc) {
        res.json(doc);
    });
}

function deleteAnnouncement(id, req, res) {
    db.contactlist.update({
        _id: mongojs.ObjectId(id)
    }, {
        $pull : {"announcements" : {"id": req.body.id}}
    }, function(err, doc) {
        res.json(doc);
    });
}

app.listen(port);
console.log("Server running on port 3000");