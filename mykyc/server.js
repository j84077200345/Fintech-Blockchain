var express=require("express");
var path=require("path");
var bodyparser=require("body-parser");
var zlib = require('zlib');
var LZUTF8 = require('lzutf8');
var brotli = require('brotli');
var CryptoJS = require("crypto-js");
var nodemailer = require('nodemailer');
var multer  = require('multer');
var request = require('request');
const { imageHash }= require('image-hash');
// var QRCode = require('qrcode');
const fs = require('fs');
const deepai = require('deepai');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
});
var upload = multer({storage: storage});

var app=express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:false }));
app.use(express.static(path.join(__dirname,'public')));
app.use('/images', express.static(__dirname + '/images'));

app.get('/',function(req,res) {
	res.sendFile(__dirname+"/public/index.html");
});
app.get('/reg',function(req,res){
	res.sendFile(__dirname+"/public/kyc_register.html");
});
app.get('/org_login',function(req,res){
	res.sendFile(__dirname+"/public/home.html");
});
app.get('/cus_login', function(req, res) {
	res.sendFile(__dirname+"/public/customer_login.html");
});
app.get('/house', function(req, res) {
	res.sendFile(__dirname+"/public/house_login.html");
});

app.post('/kyc_data', upload.single('image'), function(req, res) {
	var kyc_data = req.body;
	console.log(kyc_data);

	var options = { method: 'POST',
		url: 'https://fintech-data.firebaseio.com/customers.json',
		headers: 
		{ 'postman-token': '72ed6968-46a4-f89f-ed5e-aaad20732807',
			'cache-control': 'no-cache',
			'content-type': 'application/json' },
		body: kyc_data,
		json: true
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		console.log(body);
	});
	
	res.sendFile(__dirname+"/public/index.html");
});

app.post('/home_submit',upload.array('uidbackup', 12), function(req, res) {
	var uidHash;
	var revenueHash;
	var uid = req.body.uid_name;
	var revenue = req.body.revenue_name;

	imageHash('./images/' + uid, 16, true, (error, data) => {
		if (error) throw error;
		uidHash = data;
		// console.log('uidHash', uidHash);

		imageHash('./images/' + revenue, 16, true, (error, data) => {
			if (error) throw error;
			revenueHash = data;
			// console.log('revenueHash', revenueHash);

			var rootHash = CryptoJS.SHA256(uidHash + revenueHash);
			// console.log(rootHash.toString());
			
			var options = {
				method: 'PUT',
				url: 'https://fintech-data.firebaseio.com/hash.json',
				headers: {
					'content-type': 'application/json'
				},
				body: { revenue: revenueHash, uid: uidHash, root: rootHash.toString() },
				json: true 
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				console.log(body);
				res.sendFile(__dirname+"/public/display_tree.html");
			});
		});
	});
});

app.post('/check_result', upload.single('uid'), function(req, res) {
	var uid_old = req.body.uid_copy;
	var uid_new = req.body.uid_new;
	
	deepai.setApiKey('ab40932a-a9fb-42d4-9f22-9f4a085df9dd');

	(async function() {
		var resp = await deepai.callStandardApi("image-similarity", {
				image1: fs.createReadStream("images/" + uid_old),
				image2: fs.createReadStream("images/" + uid_new),
		});
	//    console.log(resp.output.distance);
		if(resp.output.distance <= 10) {
			console.log('match');
			res.sendFile(__dirname+"/public/match.html");
		}else{
			console.log('not match');
			res.sendFile(__dirname+"/public/not_match.html");
		}
	})()
});

app.listen(3000,function(){
	console.log("Server Running in the port 3000");
})

app.post('/compress-lzutf8', function(req,res){

	console.log(req.body.json);
	var input = req.body.json;
	// var input = CryptoJS.AES.decrypt(ciphertext, "mypassword" ).toString(CryptoJS.enc.Utf8);
	console.log("Decrypted : " + input + "\n");

   	console.log("Original size : " + input.length);
   	console.log("\n");
   	
   	var deflated = LZUTF8.compress(input);
   	console.log("Deflated byteLength: " + deflated.byteLength);
   	console.log("Deflated string: " + deflated.toString('utf8'));
   	console.log("Deflated join: " + deflated.join(""));

	var deflatedString = getString(deflated);
  	// var deflatedEncrypt = CryptoJS.AES.encrypt(deflatedString,"mypassword").toString();
	
	console.log('deflatedString: ', deflatedString);
	res.send(deflatedString);
});

app.post('/compress-deflate',function(req,res){
	
	console.log(req.body.json);
	var input = req.body.json;
	// var input = CryptoJS.AES.decrypt(ciphertext, "mypassword" ).toString(CryptoJS.enc.Utf8);
	console.log("Decrypted : " + input + "\n");

   	console.log("Original size : " + input.length);
   	console.log("\n");
   	
	var deflatedString = zlib.deflateSync(input).toString('base64');
	
	console.log("Deflated : "+deflatedString);
	console.log("Deflated size : "+deflatedString.length);
   	console.log("Deflated string: "+getString(deflated));
   	console.log("Deflated join: "+deflated.join(""));

   	var deflatedString = getString(deflated);
   	// var deflatedEncrypt = CryptoJS.AES.encrypt(deflatedString,"mypassword").toString();
   	res.send(deflatedEncrypt);
});

app.post('/compress-brotli',function(req,res){
	
	console.log(req.body.json);
	var input = req.body.json;
	// var input = CryptoJS.AES.decrypt(ciphertext, "mypassword" ).toString(CryptoJS.enc.Utf8);
	console.log("Decrypted : "+input+"\n\n");

   	console.log("Original size : "+input.length);
   	console.log("\n\n");
   	
	var deflated = brotli.compress(input);
	console.log("deflated "+deflated);
	//console.log("inflated : "+brotli.decompress(getString(deflated)));
	// console.log("inflated string : " + brotli.decompress(deflated));
	console.log("Deflated bytelength: " + deflated.byteLength);
   	console.log("Deflated string: " + getString(deflated));
   	console.log("Deflated join: " + deflated.join(""));

   	var deflatedString = getString(deflated);
   	// var deflatedEncrypt = CryptoJS.AES.encrypt(deflatedString,"mypassword").toString();
   	res.send(deflatedString);

});
app.post('/view_customer',function(req,res){

	res.setHeader('Content-Type', 'application/json');
    	
	var encryptedJSON = req.body.json;
	var key = req.body.key;
	console.log("Encrypted json : "+encryptedJSON);
	try{
		var input = CryptoJS.AES.decrypt(encryptedJSON, req.body.key ).toString(CryptoJS.enc.Utf8);
		console.log("Decrypted : "+input);
		var jsonString = decompress(input);
		console.log("Json string : "+jsonString);
		res.send(JSON.stringify({error:"",json:jsonString}));
	}
	catch(err) {
		console.log(err);
		res.send(JSON.stringify({ error: "invalid_key" }));
		//res.json({error:"invalid_key"}).send("localhost:3000/invalid_key.html")
	}
	
	console.log(key);
});

function getString(ba) {
	var result="";
	for(var i = 0; i < ba.length; ++i){
		result += (String.fromCharCode(ba[i]));
	}
	console.log(result);
	return result;
}

function getBytes(str) {
	var bytes = [];
	var charCode;

	for (var i = 0; i < str.length; ++i)
	{
	    charCode = str.charCodeAt(i);
	    bytes.push(charCode & 0xFF);
	}

	return bytes;
}
function getByteLength(str) {
	return Buffer.byteLength(str,'utf8');
}

app.post('/decompress',function(req,res){

	console.log(req.body.cjson);
	var encrypted = req.body.cjson;
	console.log("encrypted  : "+encrypted);

	var deflatedString = CryptoJS.AES.decrypt(encrypted, "mypassword" ).toString(CryptoJS.enc.Utf8);
	var deflatedBytes = getBytes(deflatedString);
	console.log("deflated : "+deflatedString);
	console.log("deflated : "+deflatedBytes);
	//var inflated = zlib.inflateSync(deflatedBytes.toString('base64')).toString();
	var inflated = LZUTF8.decompress(new Buffer(deflatedBytes,'base64')).toString();
	console.log("inflated : "+inflated.toString());
	
	var inflatedEncrypt = CryptoJS.AES.encrypt(inflated,"mypassword").toString();
	console.log(inflatedEncrypt);
	res.send(inflatedEncrypt);
	
});

function decompress(deflatedString) {
	var deflatedBytes = getBytes(deflatedString);
	console.log("deflated : "+deflatedString);
	console.log("deflated : "+deflatedBytes);
	//var inflated = zlib.inflateSync(deflatedBytes.toString('base64')).toString();
	var inflated = LZUTF8.decompress(new Buffer(deflatedBytes,'base64')).toString();
	return inflated;
}

app.post("/sendmail",function(req,res){

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		  user: 'noreplyKYC.project@gmail.com',
		  pass: 'kycpassword'
		}
	  });
	  
	  var mailOptions = {
		from: 'noreplyKYC.project@gmail.com',
		to: req.body.email,
		subject: 'KYC Password',
		html: 'Dear user please find below the secret key for KYC verification \n '+req.body.key+'<br><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+req.body.key+'"><br> Do not share this confidential information to anyone !<br>'
	  };
	  
	  transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log(error);
		} else {
		  console.log('Email sent: ' + info.response);
		}
	  });
	  
});
app.post("/alertmail",function(req,res){

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		  user: 'noreplyKYC.project@gmail.com',
		  pass: 'kycpassword'
		}
	  });
	  
	  var mailOptions = {
		from: 'noreplyKYC.project@gmail.com',
		to: req.body.email,
		subject: 'KYC Access alert',
		text: "Dear customer , \n\t Your KYC Data was accessed recently by "+req.body.oname+" at "+req.body.time+"\n If this activity is unusual please contact your nearest KYC organization for key change"
	  };
	  
	  transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log(error);
		} else {
		  console.log('Email sent: ' + info.response);
		}
	  });

});
	/*
	console.log("\n\n");
	console.log("Compression using lzutf8");
	var output = LZUTF8.compress(input);
	var newSize2 = getByteLength(output);
	console.log("Output size : "+newSize2+" bytes");
	
	console.log("Compression ratio : "+((newSize2/oldSize)*100).toPrecision(4)+"%");
	console.log("\n\nBrotli compression ")
	var bcompress = brotli.compress(input).toString('utf8');
	var newSize3 = getByteLength(bcompress);
	console.log("Output size : "+newSize3+" bytes");
	console.log("Compression ratio : "+((newSize3/oldSize)*100).toPrecision(4)+"%");
	console.log("\n\n--------------------------\n\n");
   	//var deflated = brotli.compress(input).toString('base64');
	//var deflated = zlib.deflateSync(input).toString('base64');
	console.log("deflated : "+deflated.toString('base64'));
	var newSize1 = getByteLength(deflated);
	console.log("Compression using deflate");
	console.log("Output size : "+newSize1+" bytes");
	console.log("Compression ratio : "+((newSize1*100)/oldSize).toPrecision(4)+"%");
	
	var deflatedEncrypt = CryptoJS.AES.encrypt(deflated, key, {iv: iv,padding:CryptoJS.pad.NoPadding});
	
	console.log(deflatedEncrypt.ciphertext);
	res.send(deflatedEncrypt.ciphertext);
	
	res.send("hello");
	*/