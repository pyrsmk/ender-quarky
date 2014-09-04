/*
	quarky, a tiny DOM utility

	Author
		Aurélien Delogu (dev@dreamysource.fr)
*/

(function(){

	var html,body,
		s,scrollElement=function(){
			if(!s){
				body.scrollTop+=1;
				s=body.scrollTop?body:html;
				body.scrollTop-=1;
			}
			return s;
		},
		toEnder=function(nodes){
			if(nodes.length===undefined){
				nodes=$(nodes);
			}
			return nodes;
		},
		verify=function(nodes){
			var type;
			switch(nodes){
				case undefined:
					type='undefined';
					break;
				case null:
					type='undefined';
					break;
			}
			if(type){
				throw 'The parameter is '+type;
			}
		};

	$(document).ready(function(){
		html=document.documentElement;
		body=document.body;
	});

	/*
		Create a node from HTML code

		Parameters
			String html

		Return
			Object

		Notes
			Based on Bonzo's method (https://github.com/ded/bonzo)
	*/
	$.create=function(html){
		var table=['<table>','</table>',1],
			td=['<table><tbody><tr>','</tr></tbody></table>',3],
			option=['<select>','</select>',1],
			noscope=['_','',0],
			tags={
				thead:table,
				tbody:table,
				tfoot:table,
				colgroup:table,
				caption:table,
				tr:['<table><tbody>','</tbody></table>',2],
				th:td,
				td:td,
				col:['<table><colgroup>','</colgroup></table>',2],
				fieldset:['<form>','</form>',1],
				legend:['<form><fieldset>','</fieldset></form>',2],
				option:option,
				optgroup:option,
				script:noscope,
				style:noscope,
				link:noscope,
				param:noscope,
				base:noscope
			},
			tag=/^\s*<([^\s>]+)/.exec(html),
			el=document.createElement('div'),
			map=tag?tags[tag[1].toLowerCase()]:null,
			depth=map?map[2]+1:1;
		el.innerHTML=map?map[0]+html+map[1]:html;
		while(depth--){
			el=el.firstChild;
		}
		return $(el);
	};

	$.ender({

		/*
			Return a css property, set a css property or set a list of properties

			Parameters
				String, Object name
				String, undefined value

			Return
				String, Object, null
		*/
		css:function(name,value){
			var // Translate CSS name to JS syntax
				translateName=function(name){
					return name.replace(/-([a-z])/g,function(str,p1){
						return p1.toUpperCase();
					});
				},
				// Set a CSS property
				setStyle=function(els,name,value){
					name=translateName(name);
					for(var i=0,j=els.length;i<j;++i){
						if(name=='opacity'){
							try{els[i].filters['DXImageTransform.Microsoft.Alpha'].opacity=value*100;}
							catch(e){
								try{els[i].filters('alpha').opacity=value*100;}
								catch(e){els[i].style.opacity=value;}
							}
						}
						else{
							els[i].style[name]=value;
						}
					}
					return els;
				},
				// Get a CSS property
				getStyle=function(el,name){
					name=translateName(name);
					if(name=='opacity'){
						try{return el.filters['DXImageTransform.Microsoft.Alpha'].opacity/100;}
						catch(e){
							try{return el.filters('alpha').opacity/100;}
							catch(e){return el.style.opacity;}
						}
					}
					return el.style[name] || null;
				};
			if(typeof name=='string'){
				// Get a CSS property
				if(value===undefined){
					return getStyle(this[0],name);
				}
				// Set a CSS property
				else{
					setStyle(this,name,value);
					return this;
				}
			}
			// Set a list of CSS properties
			else if(typeof name=='object'){
				for(var i in name){
					setStyle(this,i,name[i]);
				}
				return this;
			}
		},

		/*
			Return or set html content

			Parameters
				String html

			Return
				String, Object
		*/
		html:function(html){
			// Get node's html
			if(html===undefined){
				if(this[0].nodeName=='IFRAME'){
					return this[0].src.substr(29);
				}
				else{
					return this[0].innerHTML;
				}
			}
			// Set node's html
			else{
				for(var i=0,j=this.length;i<j;++i){
					if(this[i].nodeName=='IFRAME'){
						this[i].src='data:text/html;charset=utf-8,'+encodeURI(html);
					}
					else{
						this[i].innerHTML=html;
					}
				}
				return this;
			}
		},

		/*
			Return or set text content

			Parameters
				String text

			Return
				String, Object
		*/
		text:function(text){
			// Get node's text
			if(text===undefined){
				return this[0].innerText!==undefined?
					this[0].innerText:
					this[0].textContent.replace(/^\s*(.+?)\s*$/,'$1');
			}
			// Set node's text
			else{
				for(var i=0,j=this.length;i<j;++i){
					if(this[i].innerText!==undefined){
						this[i].innerText=text;
					}
					else{
						this[i].textContent=text;
					}
				}
				return this;
			}
		},

		/*
			Return an attribute, set a list of attributes, set just one or remove one

			Parameters
				String, Object name
				String, undefined value

			Return
				Array, String, Object
		*/
		attr:function(name,value){
			var i,j,k;
			if(typeof name=='string'){
				// Get an attribute
				if(value===undefined){
					return this[0].getAttribute(name);
				}
				// Remove an attribute
				else if(value===null){
					for(i=0,j=this.length;i<j;++i){
						this[i].removeAttribute(name);
					}
					return this;
				}
				// Set an attribute
				else{
					for(i=0,j=this.length;i<j;++i){
						this[i].setAttribute(name,value);
					}
					return this;
				}
			}
			// Set a list of attributes
			else if(typeof name=='object'){
				for(k in name){
					for(i=0,j=this.length;i<j;++i){
						this[i].setAttribute(i,name[k]);
					}
				}
				return this;
			}
		},

		/*
			Return a list of data attributes, return one, set a list or one

			Parameters
				String, Object name
				String value

			Return
				Array, String, Object
		*/
		data:function(name,value){
			var i;
			// Get the data list
			if(name===undefined){
				var values={},
					attributes=this[0].attributes,
					i,j;
				for(i=0,j=attributes.length;i<j;++i){
					if(/^data-/i.test(attributes[i].name)){
						values[attributes[i].name.substring(5)]=attributes[i].value;
					}
				}
				return values;
			}
			// Set a list of data attributes
			else if(typeof name=='object'){
				for(i in name){
					this.attr('data-'+i,name[i]);
				}
			}
			// Get a data attribute
			else if(value===undefined){
				return this.attr('data-'+name);
			}
			// Set a data attribute
			else{
				this.attr('data-'+name,value);
			}
			return this;
		},

		/*
			Return a value or set one

			Parameters
				String value

			Return
				Array, String, Object
		*/
		val:function(value){
			// Return an input's value
			if(value===undefined){
				if(this[0].type=='checkbox'){
					return this[0].checked;
				}
				else{
					return this[0].value;
				}
			}
			// Set an input's value
			else{
				for(var i=0,j=this.length;i<j;++i){
					if(this[i].type=='checkbox'){
						this[i].checked=value;
					}
					else{
						this[i].value=value;
					}
				}
				return this;
			}
		},

		/*
			Append a node

			Parameters
				Object nodes

			Return
				Object
		*/
		append:function(nodes){
			var o=this[0];
			toEnder(nodes).forEach(function(el){
				o.appendChild(el);
			});
			return this;
		},

		/*
			Prepend a node

			Parameters
				Object nodes

			Return
				Object
		*/
		prepend:function(nodes){
			var o=this[0],
				o2=this.children()[0];
			toEnder(nodes).forEach(function(el){
				o.insertBefore(el,o2);
			});
			return this;
		},

		/*
			Add a node before the current node

			Parameters
				Object nodes

			Return
				Object
		*/
		before:function(nodes){
			var o=this.parent()[0],
				o2=this[0];
			toEnder(nodes).forEach(function(el){
				o.insertBefore(el,o2);
			});
			return this;
		},

		/*
			Add a node after the current node

			Parameters
				Object nodes

			Return
				Object
		*/
		after:function(nodes){
			var next=this.next();
			if(next.length){
				return next.before(nodes);
			}
			else{
				return this.parent().append(nodes);
			}
		},

		/*
			Remove the current node
		*/
		remove:function(){
			this.forEach(function(el){
				el.parentNode.removeChild(el);
			});
		},

		/*
			Return node's parent

			Return
				Object
		*/
		parent:function(){
			var els=[];
			this.forEach(function(el){
				els.push(el.parentNode);
			});
			return $(els);
		},

		/*
			Return node's previous node

			Return
				Object
		*/
		previous:function(){
			var els=[],
				prev;
			this.forEach(function(el){
				prev=el;
				do{
					prev=prev.previousSibling;
				}
				while(prev && prev.nodeType!=1);
				if(prev){
					els.push(prev);
				}
			});
			return $(els);
		},

		/*
			Return node's next node

			Return
				Object
		*/
		next:function(){
			var els=[],
				next;
			this.forEach(function(el){
				next=el;
				do{
					next=next.nextSibling;
				}
				while(next && next.nodeType!=1);
				if(next){
					els.push(next);
				}
			});
			return $(els);
		},

		/*
			Return node's children

			Return
				Array
		*/
		children:function(){
			return $(this[0].children);
		},

		/*
			Add a class to the current node

			Parameters
				String cls

			Return
				Object
		*/
		addClass:function(cls){
			this.forEach(function(el){
				el.className+=' '+cls;
			});
			return this;
		},

		/*
			Remove a class from the current node

			Parameters
				String cls

			Return
				Object
		*/
		removeClass:function(cls){
			var re=new RegExp('\\b'+cls+'\\b');
			this.forEach(function(el){
				el.className=el.className.replace(re,'');
			});
			return this;
		},

		/*
			Test if a class exists

			Parameters
				String cls

			Return
				Boolean
		*/
		hasClass:function(cls){
			var re=new RegExp('\\b'+cls+'\\b');
			return re.test(this[0].className);
		},

		/*
			Set/get width

			Parameters
				Number value

			Return
				Number
		*/
		width:function(value){
			if(value===undefined){
				if(this[0]===window){
					return html.clientWidth;
				}
				else if(this[0]===document || this[0]===html || this[0]===body){
					return Math.max(body.scrollWidth,body.offsetWidth,html.clientWidth,html.scrollWidth,html.offsetWidth);
				}
				else{
					return this[0].offsetWidth;
				}
			}
			else{
				this.css('width',value+'px');
				return this;
			}
		},

		/*
			Set/get height

			Parameters
				Number value

			Return
				Number
		*/
		height:function(value){
			if(value===undefined){
				if(this[0]===window){
					return html.clientHeight;
				}
				else if(this[0]===document || this[0]===html || this[0]===body){
					return Math.max(body.scrollHeight,body.offsetHeight,html.clientHeight,html.scrollHeight,html.offsetHeight);
				}
				else{
					return this[0].offsetHeight;
				}
			}
			else{
				this.css('height',value+'px');
				return this;
			}
		},

		/*
			Set/get top offset

			Parameters
				Number value

			Return
				Number
		*/
		top:function(value){
			if(value===undefined){
				var top=this.css('top');
				if(top){
					return parseInt(top.replace(/[a-z]+/i,''),10);
				}
				return top;
			}
			else{
				this.css('top',value+'px');
				return this;
			}
		},

		/*
			Set/get bottom offset

			Parameters
				Number value

			Return
				Number
		*/
		bottom:function(value){
			if(value===undefined){
				var bottom=this.css('bottom');
				if(bottom){
					return parseInt(bottom.replace(/[a-z]+/i,''),10);
				}
				return bottom;
			}
			else{
				this.css('bottom',value+'px');
				return this;
			}
		},

		/*
			Set/get left offset

			Parameters
				Number value

			Return
				Number
		*/
		left:function(value){
			if(value===undefined){
				var left=this.css('left');
				if(left){
					return parseInt(left.replace(/[a-z]+/i,''),10);
				}
				return left;
			}
			else{
				this.css('left',value+'px');
				return this;
			}
		},

		/*
			Set/get right offset

			Parameters
				Number value

			Return
				Number
		*/
		right:function(value){
			if(value===undefined){
				var right=this.css('right');
				if(right){
					return parseInt(right.replace(/[a-z]+/i,''),10);
				}
				return right;
			}
			else{
				this.css('right',value+'px');
				return this;
			}
		},

		/*
			Clone

			Return
				Node
		*/
		clone:function(){
			var els=[];
			this.forEach(function(el){
				els.push(el.cloneNode(true));
			});
			return $(els);
		},

		/*
			Add a listener

			Parameters
				String event
				Function func

			Return
				Object
		*/
		on:function(event,func){
			event=event.split(' ');
			for(var i=0,j=event.length;i<j;++i){
				this.forEach(function(el){
					if(el.addEventListener){
						el.addEventListener(event[i],func,false);
					}
					else{
						el.attachEvent('on'+event[i],func);
					}
				});
			}
			return this;
		},

		/*
			Set/get scrollTop

			Parameters
				Number value

			Return
				Number, Object
		*/
		scrollTop:function(value){
			if(this[0]===window || this[0]===document || this[0]===html || this[0]===body){
				if(value!==undefined){
					scrollElement().scrollTop=value;
					return this;
				}
				else{
					return scrollElement().scrollTop;
				}
			}
			else{
				if(value!==undefined){
					this[0].scrollTop=value;
					return this;
				}
				else{
					return this[0].scrollTop;
				}
			}
		},

		/*
			Set/get scrollLeft

			Parameters
				Number value

			Return
				Number, Object
		*/
		scrollLeft:function(value){
			if(this[0]===window || this[0]===document || this[0]===html || this[0]===body){
				if(value!==undefined){
					scrollElement().scrollLeft=value;
					return this;
				}
				else{
					return scrollElement().scrollLeft;
				}
			}
			else{
				if(value!==undefined){
					this[0].scrollLeft=value;
					return this;
				}
				else{
					return this[0].scrollLeft;
				}
			}
		},

		/*
			Get computed style

			Parameters
				String name
				Boolean clean

			Return
				String, Number, null
		*/
		getComputedStyle: function(name,clean){
			var value=null;
			if(this[0].currentStyle){
				value=this[0].currentStyle[name.replace(/-([a-z])/g,function(s,p1){return p1.toUpperCase();})];
			}
			if(window.getComputedStyle){
				value=window.getComputedStyle(this[0]).getPropertyValue(name);
			}
			if(clean){
				value=parseInt(value.replace(/[a-z]+$/,''),10);
			}
			return value;
		}

	},true);

}());