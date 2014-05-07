// Module dependencies

var express    = require('express'),
    mysql      = require('mysql'),
    ejs        = require('ejs'),
    connect    = require('connect');


// Application initialization

var connection = mysql.createConnection({
        host     : 'cwolf.cs.sonoma.edu',
        user     : 'nruan',
        password : '3695762'
    });
    
//var app = module.exports = express.createServer();
var app = express();

app.use(connect.urlencoded());

app.use(connect.json());

app.use(express.static('public')); // gets css from public folder

app.set('view engine','ejs');

app.set('views', __dirname+ '/views');

// Database setup
// connection.query('DROP DATABASE IF EXISTS test', function(err) {
//	if (err) throw err;
var createDatabaseQry = 'CREATE DATABASE IF NOT EXISTS nruan';
	connection.query(createDatabaseQry, function (err) {
	    if (err) throw err;
	    
	    connection.query('USE nruan', function (err) {
	        if (err) throw err;
        	connection.query('CREATE TABLE IF NOT EXISTS users('
	            + 'id INT NOT NULL AUTO_INCREMENT,'
	            + 'PRIMARY KEY(id),'
        	    + 'name VARCHAR(30),'
		    + 'num_badges VARCHAR(30),'
            + 'pokemon1 VARCHAR(30),'
            + 'pokemon2 VARCHAR(30),'
            + 'pokemon3 VARCHAR(30)'
	            +  ')', function (err) {
        	        if (err) throw err;
	            });
	    });
	});
//});

// Configuration



//app.use(express.bodyParser());

app.use(connect.urlencoded());
app.use(connect.json());

app.use(express.static('public')); // gets css from public folder

app.set('view engine','ejs');

app.set('views', __dirname+ '/views');


// subtitle values access via the header template
app.set('subtitle', 'Lab 18');

app.get('/group/view', function(req, res){
    res.render('views');
});

app.get('/heroes', function(req, res){
    res.render('heroes');
});

app.get('/add_hero', function(req, res){
    res.render('add_hero');
});

app.get('/villains', function(req, res) {
        res.render('villains');
    }
);
app.get('/user', function(req, res) {
        res.render('example');
    }
);
app.get('/groups', function(req, res){
    res.render('groups');
});

app.get('/hero/create', function(req, res){
    res.render('add_hero');
});

app.get('/update', function(req, res){
    res.render('update');
});


app.get('/hero/update', function(req, res){
    res.render('update');
});
/*
app.get('/groups', function(req, res){
    res.render('groups/table');
});*/

app.get('/about', function(req, res){
    res.render('about');
});



// Main route sends our HTML file

app.get('/', function(req, res) {
    res.render('index');
});

// Update MySQL database
app.post('/heroes/update', function (req, res) {
    console.log(req.body);
    var qry1 = "UPDATE SuperHero SET FName = '" + req.body.FName + "' , LName= '"+ req.body.LName +"', Identity = '" + req.body.Identity + "' WHERE Hero_name = '" + req.body.Hero_name + "'";
    //console.log(qry1);
    connection.query (qry1,
		      function (err, result) {
			  console.log(result);
			  if (err) throw err;
			  connection.query('select * from SuperHero where FName = ?', req.body.FName,
					   function (err, result) {
					       if(result.length > 0) {
						   res.send(
						       'First Name: ' + result[0].FName + '<br />' + 
						       'Last Name: ' + result[0].LName + '<br />' +
							   'Identity: ' + result[0].Identity
						       
						   );
					       }
					       else
						   res.send('Hero Does Not Exist.');
					   }
					  );
		      }
		     );
});

// get all users in a <select>
//populates hero dropdown
app.post('/heroes/select', function (req, res) {
    //console.log(req.body);
    connection.query('select * from SuperHero', 
		     function (err, result) {
			 //console.log(result);
			 var responseHTML = '<select id="select">';
			 for (var i=0; result.length > i; i++) {
			     var option = '<option value="' + result[i].Hero_name + '">' + result[i].Hero_name + '</option>';
			     //console.log(option);
			     responseHTML += option;
			     }
            responseHTML += '</select>';
			 res.send(responseHTML);
			 });
});

app.post('/villains/select', function (req, res) {
   //console.log(req.body);
    connection.query('select * from Villain',
                     function (err, result) {
                         //console.log(result);
                         var responseHTML = '<select id="villain-list">';
                         for (var i=0; result.length > i; i++) {
                             var option = '<option value="' + result[i].V_name + '">' + result[i].V_name + '</option>';
                             //console.log(option);
                             responseHTML += option;
                             }
			 responseHTML += '</select>';
                         res.send(responseHTML);
                         });
});


// get user via GET (same code as app.post('/user') above)
app.get('/groups/table', function (req, res) {
    
    // get user by id
    console.log('aheha');
    connection.query('select * from Affiliation ', //, req.query.Group_Name, 
		     function (err, result) {
			 console.log(result);
			 if(result.length > 0) {
			     //var responseHTML = '<html><head><title>All Heroes</title><link a href="/style.css" rel="stylesheet"></head><body>';
			     //responseHTML += '<div class="title">Node.js Table of Data Example</div>';
			     //responseHTML += '<table class="table"><tr><th>Group</th><th>Alignment</th><th>HQ</th></tr>';
			     var responseHTML = '<table><tr><th>Group Name></th><th>Alignment</th><th>Headquarters</th></tr>';
			     for (var i=0; result.length > i; i++){
				 responseHTML += '<tr><td><a href="http://www.marvel.com/' + result[i].Group_Name +'">' + result[i].Group_Name + '</a></td>'  
                                 '<td>' + result[i].Alignment + '</td>' +
                                     '<td>' + result[i].HQ + '</td>' +
                                     '</tr>';
			     }
			     responseHTML += '</table>';
			     console.log(result);
			     //res.send(responseHTML);
			     res.render('displayUserTable.ejs',{rs:result});
			     
			 }
			 else
			     res.send('User does not exist.');
			 
		     });
});

app.get('/groups/view', function (req, res) {
    console.log('view');
    connection.query(' select * from PublicHeroesGroup ',
		     function(err, result){
			 if(result.length > 0){
			     var responseHTML2 = '<table><tr><th>Name></th><th>First Name</th><th>Group</th></tr>';
			     for (var i=0; result.length > i; i++){
				 responseHTML2 += '<tr><td><a href="/groups/?Group_Name=' + result[i].Hero +'">' +'</td>' + '</a>'
				 '<td>' + result[i].Fname + '</td>' +
				     '<td>' + result[i].Group + '</td>' +
				     '</tr>';
			     }
			     responseHTML2 += '</table>';
			     console.log(result);
			     //res.send(responseHTML);
			 res.render('displayMyTable.ejs',{rs:result});
			     
			 }
			    else
				res.send('User does not exist.');
			    
		       });
		    });
	
//get hero info from hero drop down hopefully
app.post('/heroes', function (req,res){
    //get user by username    
    console.log(req.body);
    console.log('Hi');
    console.log(req.body.Hero_name);
    console.log(req.query.id);
   // if(typeof req.query.id != 'undefined') {

	connection.query('select a.*, b.* from SuperHero a JOIN About_Hero b ON a.Hero_name = b.Name WHERE Hero_name = ?', req.body.Hero_name,
			 function(err,result){
			     console.log(result);
			     if (result.length > 0){
				 res.send('Hero: ' + result[0].Hero_name + '<br />' +
					  'First Name:' + result[0].FName + '<br />' +
					  'Last Name: ' + result[0].LName + '<br />' +
					  'Abilities: ' + result[0].Abilities + '<br />' +
					  'Origin: ' + result[0].Origin 
					 );
			     }
			 else
			     res.send('No information available');
			 }
			);
});
/*
	else if( typeof req.query.Hero_name != 'undefined') {
            connection.query('select Hero_name, FName from heroes where Hero_name = ?', req.query.Hero_name,
			     function (err, result) {
				 console.log(result);
				 if(result.length > 0) {
                                     res.send('Name: ' + result[0].Hero_name + '<br />' +
                                          'Num_badges: ' + result[0].FName
					     );
				 }
				 else
				     res.send('User does not exist.');
			     });
	}
	else {
             res.send('no data for user in request');
	}	     
    });*/
	 

app.post('/villains', function (req,res){
    //get user by username
    if( typeof req.body.V_name != 'undefined') {
        connection.query('select a.*, b.* from Villain a JOIN About_Villain b ON a.V_name = b.Name WHERE V_name = ?', req.body.V_name,
            function (err, result) {
                //console.log(result);
                if(result.length > 0) {
                                  res.send('Villain: ' + result[0].V_name + '<br />' +
                                           'First Name: ' + result[0].FName + '<br />' +
					   'Last Name: ' +  result[0].LName + '<br />' +
					   'Abilities: ' + result[0].Abilities + '<br />' +
					   'Origin: ' + result[0].Origin
                );
            }
            else
                res.send('User does not exist.');
                });
    }
});


    

// get all users in a <table>
app.get('/groups', function (req, res) {
    connection.query('select * from Affiliation',
		     function (err, result) {
            if(result.length > 0) {
                //var responseHTML = '<html><head><title>All Groups</title><link a href="/stylesheet.css" rel="stylesheet"></head><body>';
                //responseHTML += '<div class="title">Node.js Table of Data Example</div>';
                var responseHTML = '<table class="groups"><tr><th class="rightalign">Group Name</th><th>Affiliation</th><th>HQ</th></tr>';
                for (var i=0; result.length > i; i++) {
                    responseHTML += '<tr>' +
                                    '<td>' + result[i].Group_Name + '</td>' + 
			            '<td>'+ result[i].Affiliation + '</td>' + '<td>' + result[i].Group_Name + '</td>'
                                    '</tr>';
                }
                responseHTML += '</table>';
               
                res.send(responseHTML);
		}
			 else
			       res.send('No users exist.');
			 }
		     );        
});
/*
app.post('/hero/create', function (req, res) {
    connection.query('INSERT INTO SuperHero(Hero_name) Values( ? )', req.body.Hero_name,
//		     connection.query('INSERT (Origin) INTO About_Hero VALUES ( ? )', reg.body.Origin,
		     function (err, result) {
			 if (err) throw err;
			 console.log('progress!');
			 //callback(true);
			 //			     return;
			     
			 
			 //console.log('more progress?');
			 console.log(req.body.Hero_name);
			 console.log(req.body.Origin);
			 connection.query('INSERT INTO About_hero (Hero_name) Values( ? )', req.body.Hero_name,
 
			     //'INSERT INTO About_Hero(Name, Origin) VALUES ('+ req.body.Hero_name +',' + req.body.Origin +' )';
			 
			 //connection.query('select Name from About_Hero where Name = ?', req.body.Hero_name,
			 function (err, result) {
			     if(result.length > 0) {
				 res.send('Succesfully entered');
			     }
			     else
				 res.send('User was not inserted.');
			 });
			 //);
		    });
});
*/

/*
// Create a user
app.post('/add_hero', function (req, res) {
    console.log('please show');
    connection.query('INSERT INTO SuperHero SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            connection.query('select Hero_name, FName from SuperHero where Hero_name = ?', req.body.Hero_name, 
			     function (err, result) {
                    if(result.length > 0) {
			res.send('Username: ' + result[0].Hero_name + '<br />' +
				  'Password: ' + result[0].FName
				 );
                    }
                    else
                      res.send('User was not inserted.');
				 }
			     );
	    }
    );
});
*/


/*
// get user via GET (same code as app.post('/user') above)
app.get('/user', function (req, res) {
    
    // get user by id
    if(typeof req.query.id != 'undefined') {
        connection.query('select * from users where id = ?', req.query.id, 
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
                    var responseHTML = '<html><head><title>All Users</title><link a href="/style.css" rel="stylesheet"></head><body>';
                    responseHTML += '<div class="title">Node.js Table of Data Example</div>';
                    responseHTML += '<table class="users"><tr><th>ID</th><th>Username</th><th>Password</th></tr>';
                    responseHTML += '<tr><td>' + result[0].id + '</td>' + 
                                    '<td>' + result[0].name + '</td>' +
                                    '<td>' + result[0].num_badges + '</td>' +
                                    '</tr></table>';
                    responseHTML += '</body></html>';
                    res.send(responseHTML);
                }
                else
                  res.send('User does not exist.');
            }
        );     
    }
    //get user by username    
    else if( typeof req.query.name != 'undefined') {
        connection.query('select name, num_badges from users where name = ?', req.query.name, 
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
		                  res.send('Name: ' + result[0].name + '<br />' +
					          'Num_badges: ' + result[0].num_badges
                );
            }
            else
                res.send('User does not exist.');
		});
    }
    else {
        res.send('no data for user in request');
    }
});

// Create a user
/*
app.post('/user/create', function (req, res) {
    connection.query('INSERT INTO users SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            connection.query('select name, num_badges from users where name = ?', req.body.name, 
			     function (err, result) {
                    if(result.length > 0) {
			res.send('Username: ' + result[0].name + '<br />' +
				  'Password: ' + result[0].num_badges
				 );
                    }
                    else
                      res.send('User was not inserted.');
				 }
			     );
	    }
    );
});*/

app.post('/hero/create', function (req, res) {
    connection.query('INSERT INTO SuperHero SET ?', req.body,
        function (err, result) {
            if (err) throw err;
            connection.query('select * from SuperHero where Hero_name = ?', req.body.Hero_name,
                             function (err, result) {
                    if(result.length > 0) {
                        res.send('Hero: ' + result[0].Hero_name + '<br />' +
                                  'First Name: ' + result[0].FName  + '<br />' +
				 'Last Name: ' + result[0].LName  + '<br />' +
				 'Identity: ' + result[0].Identity  + '<br />' 

                                 );
                    }
                    else
                      res.send('User was not inserted.');
                                 }
                             );
            }
    );
});

// Begin listening

app.listen(8020);
console.log("Express server listening on port %d in %s mode", app.settings.env);
