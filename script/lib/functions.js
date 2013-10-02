var $ = function(id) {
		return document.getElementById(id);
	},

	ErrorMessage = function(s) {
		var li = newElement('li');

		li.innerHTML = s || 'unknown error';
		$('#log-output').appendChild(li);
	},

	LogMessage = function(s) {
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

		return path.toLowerCase();
	},

	compress = function(code) {
		var i,
			len = code.length,
			result = '';

		for(i = 0; i < len; i++) {
			if(code[i].match(/\s/)) {
				this.result += code[i];
			}
		}

		return result;
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