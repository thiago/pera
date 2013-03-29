/**
 * Created with PyCharm.
 * User: thiagorsouz
 * Date: 13/03/13
 * Time: 02:11
 * To change this template use File | Settings | File Templates.
 */
/*
Example usage Parse
string = "user(1),about,accounts.limit(20).fields(hometown,albums.limit(10).fields(comments))"
newParams.parse(string);
return {
	'about': null,
	'accounts': {
		'fields': {
			'hometown': null,
			'albums': {
				'fields': {
					'comments': null
				},
				'limit': '10'
			}
		},
		'limit': '20'
	},
	'user': '1'
}

Example usage strigify

newParams.strigify(object);
return "user(1),about,accounts.limit(20).fields(hometown,albums.limit(10).fields(comments))"
*/

var newParams   = {
	parse: function(str){
		var attrs             = [],
			aux                 = str.split(""),
			arr                 = {},
			attr                = '',
			_sub_attr           = '',
			r                   = 0,
			f                   = 0,
			v                   = 0,
			d                   = 0,
			_c_value            = null,
			_sub                = 0,
			_p_start            = 0;

		for(var i in aux) {
			var c          = aux[i];
			switch(c){
				case '(':
					r++;
					f   = 1;
					if(_p_start === 0) _p_start = i;
					break;
				case ')':
					r--;
					break;
				case '.':
					d      = 1;
					_sub   = 1;
					break;
				case ',':
					v      = 1;
					break;
			}
			if(v === 0 && !_sub){
				attr        += c;
			}
			if(_sub){
				if(d === 0 && f === 0 && v === 0)
					_sub_attr   += c;
			}
			if(r === 0 && f == 1) {
				_c_value             = str.substr(++_p_start , i - _p_start);
				if(_sub){
					_sub_attr = _sub_attr.replace(_c_value, '');
				}else{
					attr = attr.replace('(' + _c_value + ')', '');
				}
				if(_sub_attr){
					arr[attr]               = arr[attr] || {};
					arr[attr][_sub_attr]    = _c_value;
					if(_sub_attr == "fields")
						arr[attr][_sub_attr]    = this.parse(_c_value);
				}else{
					arr[attr]               = _c_value;
				}
				_c_value    = '';
				_p_start    = 0;
				f           = 0;
				_sub_attr   = '';
			}
			if((v && r === 0) || i == aux.length - 1){
				if(!arr[attr]) arr[attr]    = null;
				attrs.push(attr);
				attr         = '';
				_sub         = 0;
			}
			v = 0;
			d = 0;
		}
		return arr;
	},
	stringify: function(obj){
		var unparsed        = '';
		if(typeof(obj) == typeof({})){
			for(var i in obj){
				var current     = obj[i];
				unparsed		+= unparsed ? ',' + i : i;
				if(typeof(current) == typeof({})){
					for(var j in current){
						unparsed += '.' + j;
						if(current[j]){
							unparsed += '(' + this.stringify(current[j]) + ')';
						}
					}
				}else{
					if(current){
						unparsed += '(' + current + ')';
					}
				}
			}
		}else{
			unparsed += obj;
		}
		return unparsed;
	}
};