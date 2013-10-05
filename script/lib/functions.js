var $ = function(id) {
		return document.getElementById(id);
	},

	errorMessage = function(s) {
		var li = newElement('li');

		li.innerHTML = s || 'unknown error';
		$('#log-output').appendChild(li);
	},

	logMessage = function(s) {
		alert(s);
	},

	trim = function(s) {
		return s.replace(/^\s+|\s+$/g, '').toLowerCase();
	},

	log = function(s) {
		console.log(s);
	},

	getSelector = function(e) {
		if(!e){
			return '';
		}
		
		var path = e.tagName,
			name;

		e = e.parentNode;

		while(e) {
			name = e.tagName;
			path = (name ? name : '') + '>' + path;
			e = e.parentNode;
		}

		return path.toLowerCase().slice(1);
	},

	index = function(e) {
		var parent = e.parentNode;
		if(!parent) {
			return -1;
		}
		
		var siblings = parent.children;

		siblings = Array.prototype.slice.call(siblings);

		return siblings.indexOf(e);
	};